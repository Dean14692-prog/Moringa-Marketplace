from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api # Api is imported but not used for routing, consider removing or using it
from models import db, User, Order, Merchandise, OrderItem, Project, Student, TeamProject, TeamResponse, Company, ContactRequest, Review
import os
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.exceptions import NotFound # Import NotFound for explicit error handling

basedir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(basedir, '.env')

print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
load_dotenv(dotenv_path)

print(f"DEBUG: os.getenv('JWT_SECRET_KEY') after load_dotenv(): {os.getenv('JWT_SECRET_KEY')}")

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Uploads Configuration
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

db.init_app(app)
migrate = Migrate(app, db)
JWTManager(app)
api = Api(app) # Keep one instance of Api, though you're using Blueprint routes directly

# Define Blueprint BEFORE using it
api_bp = Blueprint('api', __name__, url_prefix='/api')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- Uploads Route (moved under api_bp) ---
@api_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Home Route ---
@api_bp.route('/')
def home():
    return {"message": "Welcome To Moringa MarketPlace API"}

# --- Authentication Routes ---
@api_bp.route("/whoami", methods=["GET"])
@jwt_required()
def whoami():
    print("JWT Identity:", get_jwt_identity())
    return jsonify({"id": get_jwt_identity()}), 200

@api_bp.route('/register', methods=['POST'])
def register_student():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    github = data.get('github')
    linkedin = data.get('linkedin')
    skills = data.get('skills') # Expecting a list or None

    if not all([name, email, password]):
        return jsonify({"msg": "Name, email, and password are required"}), 400

    if Student.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409

    new_student = Student(
        name=name,
        email=email,
        github=github,
        linkedin=linkedin,
        skills=','.join(skills) if isinstance(skills, list) else None # Ensure skills is a list
    )
    new_student.set_password(password)

    db.session.add(new_student)
    db.session.commit()

    return jsonify(new_student.serialize()), 201

@api_bp.route('/login', methods=['POST'])
def login_student():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"msg": "Email and password are required"}), 400

    student = Student.query.filter_by(email=email).first()

    if student and student.check_password(password):
        access_token = create_access_token(identity=student.id)
        refresh_token = create_refresh_token(identity=student.id)
        return jsonify({"access_token": access_token, "refresh_token": refresh_token}), 200
    return jsonify({"msg": "Invalid credentials"}), 401

# --- Student Routes ---
# (Removed the /students POST route as register handles creation, or you need to define admin access)

@api_bp.route('/students', methods=['GET'])
@jwt_required()
def get_all_students():
    students = Student.query.all()
    return jsonify([student.serialize() for student in students]), 200

@api_bp.route('/students/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_by_id(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404
    return jsonify(student.serialize()), 200

@api_bp.route('/students/<int:student_id>', methods=['PATCH'])
@jwt_required()
def update_student_by_id(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    # Authorization check: only allow a student to update their own profile (or admin)
    if get_jwt_identity() != student_id:
        return jsonify({"msg": "Unauthorized: Cannot update another student's profile"}), 403

    data = request.get_json()
    student.name = data.get('name', student.name)
    student.email = data.get('email', student.email)
    student.github = data.get('github', student.github)
    student.linkedin = data.get('linkedin', student.linkedin)
    if 'skills' in data:
        if isinstance(data['skills'], list):
            student.skills = ','.join(data['skills'])
        elif data['skills'] is None or data['skills'] == "":
            student.skills = None
    db.session.commit()
    return jsonify(student.serialize()), 200

@api_bp.route('/students/<int:student_id>', methods=['DELETE'])
@jwt_required()
def delete_student_by_id(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    # Authorization check: only allow a student to delete their own account (or admin)
    if get_jwt_identity() != student_id:
        return jsonify({"msg": "Unauthorized: Cannot delete another student's account"}), 403

    db.session.delete(student)
    db.session.commit()
    return jsonify({"msg": "Student deleted"}), 200

# --- Current Logged-in Student Routes ---
@api_bp.route('/student', methods=['GET'])
@jwt_required()
def get_current_student_profile():
    current_student_id = get_jwt_identity()
    student = Student.query.get(current_student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404 # Should not happen if JWT is valid
    return jsonify(student.serialize()), 200

@api_bp.route('/student', methods=['PATCH'])
@jwt_required()
def update_student_profile():
    """Update parts of the current student's profile."""
    current_student_id = get_jwt_identity()
    student = Student.query.get(current_student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    data = request.get_json()

    student.name = data.get('name', student.name)
    student.email = data.get('email', student.email)
    student.github = data.get('github', student.github)
    student.linkedin = data.get('linkedin', student.linkedin)
    if 'skills' in data:
        if isinstance(data['skills'], list):
            student.skills = ','.join(data['skills'])
        elif data['skills'] is None or data['skills'] == "":
            student.skills = None

    db.session.commit()
    return jsonify(student.serialize()), 200

# --- Project Routes ---
@api_bp.route('/student/projects', methods=['GET'])
@jwt_required()
def get_my_projects():
    """Get all projects uploaded by the currently logged-in student (for their dashboard)."""
    current_student_id = get_jwt_identity()
    projects = Project.query.filter_by(student_id=current_student_id).all()
    return jsonify([project.serialize() for project in projects]), 200

@api_bp.route('/projects', methods=['POST'])
@jwt_required()
def upload_project():
    """Upload a new project, handling file upload."""
    current_student_id = get_jwt_identity()
    title = request.form.get('title')
    category = request.form.get('category')
    description = request.form.get('description')
    github_link = request.form.get('githubLink')
    demo_link = request.form.get('demoLink')
    for_sale = request.form.get('forSale', 'false').lower() == 'true'
    try:
        price = float(request.form.get('price', 0.0))
    except ValueError:
        return jsonify({"msg": "Price must be a valid number"}), 400

    if not all([title, category, description, github_link]):
        return jsonify({"msg": "Missing required project fields (title, category, description, githubLink)"}), 400

    file_url = None
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"msg": "No file selected for upload"}), 400
        if not allowed_file(file.filename):
            return jsonify({"msg": "File type not allowed. Allowed types: png, jpg, jpeg, gif, pdf, doc, docx"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        file_url = f"/uploads/{filename}"

    new_project = Project(
        title=title,
        category=category,
        description=description,
        github_link=github_link,
        demo_link=demo_link,
        for_sale=for_sale,
        price=price,
        file_url=file_url,
        status="Pending",  # Default status
        student_id=current_student_id
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify(new_project.serialize()), 201

@api_bp.route('/me/projects/<int:project_id>', methods=['DELETE']) # Changed to take project_id in URL
@jwt_required()
def delete_my_project(project_id): # Renamed function for clarity
    """Delete a project uploaded by the currently logged-in student."""
    current_student_id = get_jwt_identity()

    project = Project.query.filter_by(id=project_id, student_id=current_student_id).first()
    if not project:
        return jsonify({"msg": "Project not found or unauthorized"}), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({"msg": "Project deleted"}), 200

@api_bp.route('/projects', methods=['GET'])
def get_all_approved_projects():
    """Get all projects with 'Approved' status (for the public Projects page)."""
    projects = Project.query.filter_by(status="Approved").all()
    return jsonify([project.serialize() for project in projects]), 200

@api_bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Get a single project by its ID."""
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404
    return jsonify(project.serialize()), 200

# --- Team Responses Routes ---
@api_bp.route('/team-responses', methods=['POST'])
@jwt_required() # Assuming team responses require authentication
def create_team_response():
    data = request.get_json()
    team_project_id = data.get('team_project_id')
    response_text = data.get('response_text')
    # Assuming the reviewer/responder is the current logged-in student
    student_id = get_jwt_identity()

    if not all([team_project_id, response_text]):
        return jsonify({"msg": "Missing required fields (team_project_id, response_text)"}), 400

    # Optional: Check if the team project exists
    team_project = TeamProject.query.get(team_project_id)
    if not team_project:
        return jsonify({"msg": "Team project not found"}), 404

    new_response = TeamResponse(
        team_project_id=team_project_id,
        response_text=response_text,
        student_id=student_id # Link response to the student who created it
    )
    db.session.add(new_response)
    db.session.commit()

    return jsonify(new_response.serialize()), 201

# ... (other team-response routes with @jwt_required() and authorization checks)

# --- Reviews Routes ---
@api_bp.route('/reviews', methods=['POST'])
@jwt_required() # Reviews should be from authenticated users
def create_review():
    current_student_id = get_jwt_identity()
    data = request.get_json()
    project_id = data.get('project_id')
    rating = data.get('rating')
    comment = data.get('comment')

    if not all([project_id, rating]):
        return jsonify({"msg": "Missing required fields (project_id, rating)"}), 400

    if not (1 <= int(rating) <= 5): # Basic rating validation
        return jsonify({"msg": "Rating must be between 1 and 5"}), 400

    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Project not found"}), 404

    new_review = Review(
        project_id=project_id,
        reviewer_id=current_student_id, # Use current student's ID
        rating=rating,
        comment=comment
    )
    db.session.add(new_review)
    db.session.commit()
    return jsonify(new_review.serialize()), 201

# ... (other review routes should also have @jwt_required() and authorization)

# --- Merchandise Routes ---
@api_bp.route('/merchandise', methods=['POST'])
@jwt_required() # Merchandise creation likely restricted to admins/vendors
def create_merchandise():
    name = request.form.get('name')
    description = request.form.get('description')
    try:
        price = float(request.form.get('price', 0.0))
    except ValueError:
        return jsonify({"msg": "Price must be a valid number"}), 400

    if not name:
        return jsonify({"msg": "Name is required"}), 400

    image_url = None
    if 'image' in request.files:
        image = request.files['image']
        if image.filename == '':
            return jsonify({"msg": "No image selected for upload"}), 400
        if not allowed_file(image.filename):
            return jsonify({"msg": "Image file type not allowed. Allowed types: png, jpg, jpeg, gif"}), 400

        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        image_url = f"/uploads/{filename}"

    new_item = Merchandise(name=name, description=description, price=price, image_url=image_url)
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.serialize()), 201

# ... (other merchandise routes with @jwt_required() for update/delete, public GETs are fine)

# --- Company Routes (Moved under api_bp and added JWT for restricted actions) ---
@api_bp.route('/companies', methods=['POST'])
@jwt_required() # Restrict company creation, perhaps to admin or specific roles
def create_company():
    data = request.get_json()
    required_fields = ['name', 'email']

    if not all(data.get(field) for field in required_fields):
        return jsonify({"msg": "Missing required fields: name, email"}), 400

    new_company = Company(
        name=data['name'],
        email=data['email'],
        description=data.get('description'),
        logo_image_url=data.get('logo_image_url'),
        bio=data.get('bio')
    )
    db.session.add(new_company)
    db.session.commit()
    return jsonify(new_company.serialize()), 201

@api_bp.route('/companies/<int:company_id>', methods=['GET'])
def get_company_by_id(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Company not found"}), 404
    return jsonify(company.serialize()), 200

@api_bp.route('/companies', methods=['GET']) # Publicly accessible for listing companies
def get_all_companies():
    companies = Company.query.all()
    return jsonify([c.serialize() for c in companies]), 200

@api_bp.route('/companies/<int:company_id>', methods=['PATCH'])
@jwt_required() # Restrict updates to authorized users/admins
def update_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Company not found"}), 404

    # Add authorization logic here, e.g., only the company itself or an admin can update
    # For now, let's assume an admin can do it, or the company user identity matches company_id (needs a company user model)
    # This might need a `User` model with `company_id` linked or a dedicated `CompanyUser` model.
    # If using just Student model, you'd need to extend for company users.

    data = request.get_json()
    company.name = data.get('name', company.name)
    company.email = data.get('email', company.email)
    company.description = data.get('description', company.description)
    company.logo_image_url = data.get('logo_image_url', company.logo_image_url)
    company.bio = data.get('bio', company.bio)

    db.session.commit()
    return jsonify(company.serialize()), 200

@api_bp.route('/companies/<int:company_id>', methods=['DELETE'])
@jwt_required() # Restrict deletion to authorized users/admins
def delete_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Company not found"}), 404

    db.session.delete(company)
    db.session.commit()
    return jsonify({"msg": "Company deleted"}), 200

@api_bp.route('/companies/<int:company_id>/verify', methods=['PATCH'])
@jwt_required() # Definitely needs admin access
def verify_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Company not found"}), 404
    # TODO: Add admin role check here
    company.is_verified = True
    db.session.commit()
    return jsonify({"msg": "Company verified"}), 200

@api_bp.route('/companies/<int:company_id>/unverify', methods=['PATCH'])
@jwt_required() # Definitely needs admin access
def unverify_company(company_id):
    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Company not found"}), 404
    # TODO: Add admin role check here
    company.is_verified = False
    db.session.commit()
    return jsonify({"msg": "Company unverified"}), 200

# --- Contact Requests Routes (Moved under api_bp) ---
@api_bp.route('/contact-requests', methods=['POST'])
def create_contact_request():
    data = request.get_json()
    company_id = data.get('company_id')
    email = data.get('email')
    message = data.get('message')

    if not all([company_id, email, message]):
        return jsonify({"msg": "Missing required fields (company_id, email, message)"}), 400

    company = Company.query.get(company_id)
    if not company:
        return jsonify({"msg": "Target company not found"}), 404

    new_request = ContactRequest(company_id=company_id, email=email, message=message)
    db.session.add(new_request)
    db.session.commit()
    return jsonify(new_request.serialize()), 201

@api_bp.route('/contact-requests/<int:request_id>', methods=['GET'])
@jwt_required() # Viewing contact requests should be restricted
def get_contact_request_by_id(request_id):
    request_obj = ContactRequest.query.get(request_id)
    if not request_obj:
        return jsonify({"msg": "Contact request not found"}), 404
    # TODO: Add authorization: only target company or admin can view
    return jsonify(request_obj.serialize()), 200

@api_bp.route('/contact-requests', methods=['GET'])
@jwt_required() # Listing contact requests should be restricted
def get_all_contact_requests():
    # TODO: Add authorization: only admin or companies can view relevant requests
    requests = ContactRequest.query.all()
    return jsonify([r.serialize() for r in requests]), 200

@api_bp.route('/contact-requests/<int:request_id>', methods=['PATCH'])
@jwt_required() # Updating contact requests should be restricted
def update_contact_request(request_id):
    request_obj = ContactRequest.query.get(request_id)
    if not request_obj:
        return jsonify({"msg": "Contact request not found"}), 404
    # TODO: Add authorization: only target company or admin can update
    data = request.get_json()
    request_obj.email = data.get('email', request_obj.email)
    request_obj.message = data.get('message', request_obj.message)
    db.session.commit()
    return jsonify(request_obj.serialize()), 200

@api_bp.route('/contact-requests/<int:request_id>', methods=['DELETE'])
@jwt_required() # Deleting contact requests should be restricted
def delete_contact_request(request_id):
    request_obj = ContactRequest.query.get(request_id)
    if not request_obj:
        return jsonify({"msg": "Contact request not found"}), 404
    # TODO: Add authorization: only target company or admin can delete
    db.session.delete(request_obj)
    db.session.commit()
    return jsonify({"msg": "Contact request deleted"}), 200

app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001)