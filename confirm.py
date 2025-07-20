
from flask import Flask, request, jsonify, Blueprint, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
from extensions import db, jwt, migrate
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity 

# Get the absolute path to the directory where app.py resides
# This makes sure load_dotenv looks in the correct place explicitly
basedir = os.path.abspath(os.path.dirname(_file_))
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
jwt.init_app(app)
migrate.init_app(app, db)

from models import Student, Project

with app.app_context():
   db.create_all()

# Serve uploaded files from the 'uploads' directory
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


api_bp = Blueprint('api', __name__, url_prefix='/api')
send_from_directory

def allowed_file(filename):
   
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS 

@app.route("/")
def index():
    return {"message": "Welcome To Moringa Innovation Marketplace"}


@api_bp.route('/register', methods=['POST'])
def register_student():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    github = data.get('github')
    linkedin = data.get('linkedin')
    skills = data.get('skills')

    if not all([name, email, password]):
        return jsonify({"msg": "Name, email, and password are required"}), 400

    if Student.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 409

    new_student = Student(
        name=name,
        email=email,
        github=github,
        linkedin=linkedin,
        skills=','.join(skills) if skills else None
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
       
        return jsonify(access_token=access_token, student=student.serialize()), 200
    return jsonify({"msg": "Invalid credentials"}), 401

# --- Protected Student-Specific Routes ---

@api_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_student_profile():
    current_student_id = get_jwt_identity()
    student = Student.query.get(current_student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404
    return jsonify(student.serialize()), 200

@api_bp.route('/me', methods=['PATCH'])
@jwt_required()
def update_student_profile():
    """Update parts of the current student's profile."""
    current_student_id = get_jwt_identity()
    student = Student.query.get(current_student_id)
    if not student:
        return jsonify({"msg": "Student not found"}), 404

    data = request.get_json()

    # Update fields if provided
    student.name = data.get('name', student.name)
    student.email = data.get('email', student.email)
    student.github = data.get('github', student.github)
    student.linkedin = data.get('linkedin', student.linkedin)
    if 'skills' in data and isinstance(data['skills'], list):
        student.skills = ','.join(data['skills'])
    elif 'skills' in data and data['skills'] is None: 
        student.skills = None

    db.session.commit()
    return jsonify(student.serialize()), 200


@api_bp.route('/me/projects', methods=['GET'])
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
    price = float(request.form.get('price', 0))

    if not all([title, category, description, github_link]):
        return jsonify({"msg": "Missing required project fields"}), 400

    file_url = None
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            return jsonify({"msg": "No selected file"}), 400
       
        if file and allowed_file(file.filename):
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
        status="Pending",
        student_id=current_student_id
    )

    db.session.add(new_project)
    db.session.commit()

    return jsonify(new_project.serialize()), 201

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



app.register_blueprint(api_bp)

if __name__ == "_main_":
    app.run(debug=True, port=5000)