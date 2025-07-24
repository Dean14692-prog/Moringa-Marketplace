# app.py
from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api, Resource
# Ensure your models.py is correctly defined and accessible
from models import db, User, Role, Project, UsersProject, Review, Merchandise, Order, OrderItem
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
from datetime import timedelta, datetime
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


# --- Configuration ---
# Get the base directory of the current file (app.py)
basedir = os.path.abspath(os.path.dirname(__file__))
# Construct the path to the .env file
dotenv_path = os.path.join(basedir, '.env')

print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
# Load environment variables from .env file
load_dotenv(dotenv_path)

# Retrieve JWT Secret Key from environment variables
jwt_secret_key_from_env = os.getenv("JWT_SECRET_KEY")
if jwt_secret_key_from_env:
    print(f"DEBUG: JWT_SECRET_KEY loaded from .env: {jwt_secret_key_from_env[:5]}...{jwt_secret_key_from_env[-5:]}")
else:
    print("DEBUG: JWT_SECRET_KEY NOT loaded from .env. Using fallback.")

app = Flask(__name__)

# --- App Configurations ---
# Database URI: Prioritize DATABASE_URL from .env, fallback to SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # Suppresses a warning

# JWT Configuration
app.config["JWT_SECRET_KEY"] = jwt_secret_key_from_env or "your_fallback_jwt_secret_key" # Use loaded key or fallback
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2) # Access token expires in 2 hours

print(f"DEBUG: app.config['JWT_SECRET_KEY'] is set to: {app.config['JWT_SECRET_KEY'][:5]}...{app.config['JWT_SECRET_KEY'][-5:]}")

# File Upload Configuration
UPLOAD_FOLDER = os.path.join(basedir, "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER) # Create uploads directory if it doesn't exist
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # Max upload size: 16 MB

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

# --- CORS Configuration (Applied to the main app instance) ---
# This is placed early to ensure it acts as a global middleware
# for all requests, including preflights, before they hit blueprints.
CORS(app, resources={r"/api/*": {
    "origins": "http://localhost:5173", 
    "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"], # Explicitly allow all methods you use
    "headers": ["Content-Type", "Authorization"], # Essential for JWT and JSON bodies
    "supports_credentials": True # Crucial if you're sending JWT tokens or cookies
}})

# Optional: Enable CORS debugging for more verbose output if issues persist
# app.config['CORS_DEBUG'] = True


# --- Database & JWT Initialization ---
db.init_app(app) # Initialize SQLAlchemy with the Flask app
migrate = Migrate(app, db) # Initialize Flask-Migrate for database migrations
jwt = JWTManager(app) # Initialize JWTManager with the Flask app

# --- API Blueprint Setup ---
# Create a Blueprint for your API routes, prefixing them with '/api'
api_bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_bp) # Initialize Flask-RESTful API with the blueprint


# --- Helper Functions ---
def allowed_file(filename):
    """Checks if a file's extension is allowed for upload."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def admin_required():
    """Decorator to ensure only admin users can access a route."""
    def wrapper(fn):
        @jwt_required() # Requires a valid JWT token
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity() # Get user ID from JWT token
            current_user = User.get_by_id(current_user_id) # Fetch user from DB
            # Check if user exists and has 'admin' role
            if not current_user or (current_user.role and current_user.role.name != 'admin'):
                return {"msg": "Administration rights required"}, 403 # Forbidden
            return fn(*args, **kwargs) # Proceed if admin
        return decorator
    return wrapper

# --- Static File Serving ---
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serves uploaded files from the UPLOAD_FOLDER."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# --- Basic API Home Route ---
@api_bp.route('/')
def home():
    """Home route for the API blueprint."""
    return {"message": "Welcome To Moringa MarketPlace API"}

# --- Resources (API Endpoints) ---

class AuthRegister(Resource):
    """Handles user registration."""
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        # We will IGNORE 'role' sent from the frontend for security reasons during registration.
        # Instead, we will DETERMINE the role SOLELY based on the email domain.

        github = data.get('github')
        linkedin = data.get('linkedin')
        skills = data.get('skills')
        bio = data.get('bio')
        profile_pic = data.get('profile_pic')

        # Validate required fields (role is no longer required from frontend)
        if not all([email, password, username, first_name, last_name]):
            return {"msg": "Email, password, username, first name, and last name are required"}, 400

        try:
            # Check for existing email or username to prevent duplicates
            if User.get_by_email(email):
                return {"msg": "Email already registered"}, 409
            if User.get_by_username(username):
                return {"msg": "Username already taken"}, 409

            # --- CRITICAL FIX: Determine role SOLELY based on email domain ---
            role_name = "user" # Default role for all registrations

            if email == "samtomashi@moringaschool.com":
                role_name = "admin"
            elif email and "@student.moringaschool.com" in email:
                role_name = "student"
            # Any other email will default to "user"

            # Get or create the role in the database
            role = Role.get_by_name(role_name)
            if not role:
                role = Role.create(name=role_name) # Create role if it doesn't exist

            # Create the new user record
            new_user = User.create(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password, # Your User model's 'create' method should hash this password!
                role_id=role.id,
                bio=bio,
                profile_pic=profile_pic,
                github=github,
                linkedin=linkedin,
                skills=skills
            )
            response_data = new_user.serialize() # Serialize the new user object for response
            return response_data, 201

        except IntegrityError as e:
            db.session.rollback()
            print(f"Database Integrity Error during registration: {e}")
            if "UNIQUE constraint failed" in str(e):
                return {"msg": "A user with this email or username already exists."}, 409
            return {"msg": "Database error during registration. Please try again."}, 500
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error during registration: {e}")
            return {"msg": "An unexpected server error occurred during registration."}, 500


class AuthLogin(Resource):
    """Handles user login and JWT token generation."""
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return {"msg": "Email and password are required"}, 400

        user = User.get_by_email(email)
        # Check if user exists and password is correct
        if user and user.check_password(password): # Your User model must have check_password method
            access_token = create_access_token(identity=str(user.id)) # Create access token
            refresh_token = create_refresh_token(identity=str(user.id)) # Create refresh token
            # IMPORTANT: Return the user's role here for frontend redirection
            return {"access_token": access_token, "refresh_token": refresh_token, "role": user.role.name if user.role else "user"}, 200 # OK
        return {"msg": "Invalid credentials"}, 401 # Unauthorized


# --- User Profile Management (for logged-in user) ---
class UserProfile(Resource):
    """Manages the currently authenticated user's profile."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        try:
            user = User.get_by_id(current_user_id)
            if not user:
                return {"msg": "User profile not found"}, 404
            return user.serialize(), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error fetching user profile for ID {current_user_id}: {e}")
            return {"msg": "An unexpected error occurred while fetching user profile."}, 500

    @jwt_required()
    def patch(self):
        current_user_id = get_jwt_identity()
        user = User.get_by_id(current_user_id)
        if not user:
            return {"msg": "User profile not found"}, 404

        data = request.get_json()
        user.update( # Your User model must have an update method
            username=data.get('username', user.username),
            first_name=data.get('first_name', user.first_name),
            last_name=data.get('last_name', user.last_name),
            email=data.get('email', user.email),
            bio=data.get('bio', user.bio),
            profile_pic=data.get('profile_pic', user.profile_pic),
            github=data.get('github', user.github),
            linkedin=data.get('linkedin', user.linkedin),
            skills=data.get('skills', user.skills)
        )
        return user.serialize(), 200

# --- Project Management (for logged-in user) ---
class UserProject(Resource):
    """Manages projects uploaded by the current user."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404

        projects = Project.query.filter_by(uploaded_by=current_user.username).all()
        return [project.serialize() for project in projects], 200

    @jwt_required()
    def delete(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404

        project_id = request.args.get('project_id') # Get project ID from query parameter

        if not project_id:
            return {"msg": "Project ID is required as a query parameter"}, 400

        # Ensure the user owns the project before deleting
        project = Project.query.filter_by(id=project_id, uploaded_by=current_user.username).first()
        if not project:
            return {"msg": "Project not found or you don't have permission to delete it"}, 404

        project.delete() # Your Project model must have a delete method
        return {"msg": "Project deleted"}, 200


class ProjectUpload(Resource):
    """Handles uploading new projects."""
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)

        if not current_user:
            return {"msg": "User not found"}, 404

        # Get data from form (for file uploads)
        title = request.form.get('title')
        category = request.form.get('category', 'web')
        description = request.form.get('description')
        tech_stack = request.form.get('tech_stack', '')
        github_link = request.form.get('github_link')
        live_preview_url = request.form.get('live_preview_url', '')
        isForSale = request.form.get('isForSale', 'false').lower() == 'true'
        price = float(request.form.get('price', 0))

        file_url = None
        if 'file' in request.files: # Check if a file was sent
            file = request.files['file']
            if file.filename != '':
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename) # Sanitize filename
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path) # Save the file
                    file_url = f"/uploads/{filename}" # URL to access the file

        if not all([title, description, github_link]):
            return {"msg": "Missing required fields (title, description, github_link)"}, 400

        # Create the new project record
        new_project = Project.create( # Your Project model must have a create method
            title=title,
            category=category,
            description=description,
            tech_stack=tech_stack,
            github_link=github_link,
            live_preview_url=live_preview_url,
            isForSale=isForSale,
            price=price,
            uploaded_by=current_user.username,
            isApproved=False, # Projects are initially not approved
            status_changed_by=None,
            file=file_url
        )

        # Record the user's action of uploading this project
        UsersProject.create( # Your UsersProject model must have a create method
            user_id=current_user_id,
            project_id=new_project.id,
            action='uploading'
        )

        # Handle additional actions (e.g., adding collaborators)
        additional_actions_data = request.form.get('additional_actions_json')
        if additional_actions_data:
            try:
                actions_list = json.loads(additional_actions_data)
                for action_info in actions_list:
                    member_user_id = action_info.get('user_id')
                    action_type = action_info.get('action')

                    if member_user_id and action_type:
                        target_user = User.get_by_id(member_user_id)
                        if target_user:
                            UsersProject.create(
                                user_id=member_user_id,
                                project_id=new_project.id,
                                action=action_type
                            )
            except json.JSONDecodeError:
                app.logger.warning("Could not parse additional_actions_json")

        return new_project.serialize(), 201


class PublicProjects(Resource):
    """Provides a catalog of public (approved) projects."""
    def get(self):
        # Get query parameters for filtering
        query = request.args.get('query')
        category = request.args.get('category')
        tech_stack = request.args.get('tech_stack')
        uploaded_by_username = request.args.get('uploaded_by_username')

        projects = Project.search_and_filter( # Your Project model must have this method
            query=query,
            category=category,
            tech_stack=tech_stack,
            uploaded_by=uploaded_by_username,
            isApproved=True # Only show approved projects in public view
        )
        return [project.serialize() for project in projects], 200

class SingleProject(Resource):
    """Retrieves details for a single project."""
    def get(self, project_id):
        project = Project.get_by_id(project_id) # Your Project model must have this method
        if not project:
            return {"msg": "Project not found"}, 404
        return project.serialize(), 200

# --- Admin Panel Resources ---

class AdminProjectManagement(Resource):
    """Admin-only management of all projects (approve/reject)."""
    @admin_required()
    def get(self):
        projects = Project.get_all() # Your Project model must have this method
        return [project.serialize() for project in projects], 200

    @admin_required()
    def patch(self, project_id):
        current_admin_id = get_jwt_identity()
        current_admin = User.get_by_id(current_admin_id)
        if not current_admin:
            return {"msg": "Admin user not found"}, 404

        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404

        data = request.get_json()
        is_approved = data.get('isApproved')
        review_reason = data.get('review_reason') # Get review reason from payload

        if is_approved is None or not isinstance(is_approved, bool):
            return {"msg": "Invalid 'isApproved' status. Must be true or false."}, 400

        # If rejecting (is_approved is False), review_reason is required
        if is_approved is False and (review_reason is None or not review_reason.strip()):
            return {"msg": "Rejection reason is required when rejecting a project."}, 400

        status_changer_name = current_admin.username

        # Pass review_reason to update method
        project.update(
            isApproved=is_approved,
            status_changed_by=status_changer_name,
            review_reason=review_reason if is_approved is False else None # Store reason only if rejecting
        )

        action_type = 'approving' if is_approved else 'rejecting'

        # Record admin's action on the project
        existing_action = UsersProject.get_by_user_and_project(current_admin_id, project_id, action_type)
        if not existing_action:
            UsersProject.create(user_id=current_admin_id, project_id=project_id, action=action_type)
        else:
            existing_action.update(updated_at=datetime.now())


        return project.serialize(), 200

class AdminMerchandiseManagement(Resource):
    """Admin-only management of merchandise items."""
    @admin_required()
    def get(self):
        merchandise_items = Merchandise.get_all() # Your Merchandise model must have this method
        return [item.serialize() for item in merchandise_items], 200

    @admin_required()
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        image_url = data.get('image_url')
        stock_quantity = data.get('stock_quantity', 0)

        if not all([name, price is not None]):
            return {"msg": "Name and price are required"}, 400

        new_merchandise = Merchandise.create( # Your Merchandise model must have a create method
            name=name,
            description=description,
            price=price,
            image_url=image_url,
            stock_quantity=stock_quantity
        )
        return new_merchandise.serialize(), 201

    @admin_required()
    def patch(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id) # Your Merchandise model must have this method
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        data = request.get_json()
        merchandise.update( # Your Merchandise model must have an update method
            name=data.get('name', merchandise.name),
            description=data.get('description', merchandise.description),
            price=data.get('price', merchandise.price),
            image_url=data.get('image_url', merchandise.image_url),
            stock_quantity=data.get('stock_quantity', merchandise.stock_quantity)
        )
        return merchandise.serialize(), 200

    @admin_required()
    def delete(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        merchandise.delete() # Your Merchandise model must have a delete method
        return {"msg": "Merchandise item deleted"}, 200

class AdminProjectStats(Resource):
    """Admin-only route to get project statistics."""
    @admin_required()
    def get(self):
        total_projects = Project.query.count()
        approved_projects = Project.query.filter_by(isApproved=True).count()
        pending_projects = Project.query.filter_by(isApproved=False, review_reason=None).count() # More accurate pending count
        rejected_projects = Project.query.filter_by(isApproved=False).filter(Project.review_reason.isnot(None)).count() # Count projects explicitly rejected with a reason


        avg_rating_result = db.session.query(db.func.avg(Review.rating)).scalar()
        average_rating = round(avg_rating_result, 2) if avg_rating_result else 0.0

        top_projects_by_reviews = db.session.query(
            Project.title,
            db.func.count(Review.id).label('review_count')
        ).join(UsersProject, Project.id == UsersProject.project_id).join(Review, UsersProject.id == Review.user_project_id).group_by(Project.id).order_by(db.desc('review_count')).limit(5).all()

        return {
            "total_projects": total_projects,
            "approved_projects": approved_projects,
            "pending_projects": pending_projects,
            "rejected_projects": rejected_projects, # Added rejected projects to stats
            "average_review_rating": average_rating,
            "top_projects_by_reviews": [{"title": p.title, "review_count": p.review_count} for p in top_projects_by_reviews]
        }, 200


class MerchandiseCatalog(Resource):
    """Provides a public catalog of merchandise items."""
    def get(self):
        merchandise_items = Merchandise.get_all()
        return [item.serialize() for item in merchandise_items], 200


class UserCart(Resource):
    """Manages the user's shopping cart."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"msg": "Cart is empty. Add items to create a cart."}, 200

        return cart.serialize(), 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        merchandise_id = data.get('merchandise_id')
        quantity = data.get('quantity', 1)

        if not all([merchandise_id, quantity > 0]):
            return {"msg": "Merchandise ID and a valid quantity are required"}, 400

        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404
        if merchandise.stock_quantity < quantity:
            return {"msg": f"Not enough stock for {merchandise.name}. Available: {merchandise.stock_quantity}"}, 400

        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

        existing_item = OrderItem.query.filter_by(order_id=cart.id, merchandise_id=merchandise_id).first()
        if existing_item:
            if merchandise.stock_quantity < (existing_item.quantity + quantity):
                return {"msg": f"Adding {quantity} more would exceed stock for {merchandise.name}. Available: {merchandise.stock_quantity - existing_item.quantity}"}, 400
            existing_item.update(quantity=existing_item.quantity + quantity)
        else:
            # Assumes Order.add_item updates the cart's total_amount
            cart.add_item(merchandise.id, quantity, merchandise.price)

        merchandise.update(stock_quantity=merchandise.stock_quantity - quantity)

        return cart.serialize(), 200

    @jwt_required()
    def patch(self, item_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        new_quantity = data.get('quantity')

        if new_quantity is None or new_quantity < 0:
            return {"msg": "Valid quantity is required"}, 400

        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"msg": "No active cart found"}, 404

        item = OrderItem.get_by_id(item_id)
        if not item or item.order_id != cart.id:
            return {"msg": "Item not found in your cart"}, 404

        merchandise = Merchandise.get_by_id(item.merchandise_id)
        if not merchandise:
            return {"msg": "Associated merchandise not found"}, 500

        old_quantity = item.quantity
        quantity_change = new_quantity - old_quantity

        if quantity_change > 0 and merchandise.stock_quantity < quantity_change:
            return {"msg": f"Not enough stock to increase quantity by {quantity_change}. Available: {merchandise.stock_quantity}"}, 400

        item.update(quantity=new_quantity)
        merchandise.update(stock_quantity=merchandise.stock_quantity - quantity_change)

        db.session.refresh(cart)
        return cart.serialize(), 200

    @jwt_required()
    def delete(self, item_id):
        current_user_id = get_jwt_identity()

        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"msg": "No active cart found"}, 404

        item = OrderItem.get_by_id(item_id)
        if not item or item.order_id != cart.id:
            return {"msg": "Item not found in your cart"}, 404

        merchandise = Merchandise.get_by_id(item.merchandise_id)
        if merchandise:
            merchandise.update(stock_quantity=merchandise.stock_quantity + item.quantity)

        item.delete()
        db.session.refresh(cart)
        if not cart.order_items:
            cart.delete()
            return {"msg": "Item removed and cart is now empty"}, 200
        return cart.serialize(), 200

# --- Register Resources with API Blueprint ---
api.add_resource(AuthRegister, '/register')
api.add_resource(AuthLogin, '/login')
api.add_resource(UserProfile, '/user/profile')
api.add_resource(UserProject, '/user/projects')
api.add_resource(ProjectUpload, '/projects/upload')
api.add_resource(PublicProjects, '/projects')
api.add_resource(SingleProject, '/projects/<int:project_id>')
api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>')
api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>')
api.add_resource(AdminProjectStats, '/admin/stats/projects')
api.add_resource(MerchandiseCatalog, '/merchandise')
api.add_resource(UserCart, '/cart', '/cart/<int:item_id>')

# --- Register the API Blueprint with the Flask App ---
app.register_blueprint(api_bp)

# --- Run the Flask App ---
if __name__ == '__main__':
    with app.app_context():
        # Create database tables if they don't exist
        db.create_all()

        # --- Basic Role Seeding (CRITICAL for initial setup) ---
        # Ensure these roles exist in your database before user registration
        print("Checking/Seeding roles...")
        if not Role.get_by_name("admin"):
            Role.create(name="admin")
            print("Seeded 'admin' role.")
        if not Role.get_by_name("student"):
            Role.create(name="student")
            print("Seeded 'student' role.")
        if not Role.get_by_name("user"):
            Role.create(name="user")
            print("Seeded 'user' role.")
        print("Role seeding complete.")
        # --- End Role Seeding ---

    # Run the Flask development server on port 5555
    app.run(debug=True, port=5555)