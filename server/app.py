# # app.py
# from flask import Flask, jsonify, request, send_from_directory, Blueprint
# from flask_restful import Api, Resource
# from models import db, User, Role, Project, UsersProject, Review, Merchandise, Order, OrderItem
# import os
# import json
# from flask_cors import CORS
# from dotenv import load_dotenv
# from sqlalchemy.exc import IntegrityError
# from datetime import timedelta, datetime
# from werkzeug.utils import secure_filename
# from flask_migrate import Migrate
# from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


# # --- Configuration ---
# basedir = os.path.abspath(os.path.dirname(__file__))
# dotenv_path = os.path.join(basedir, '.env')

# print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
# load_dotenv(dotenv_path)

# jwt_secret_key_from_env = os.getenv("JWT_SECRET_KEY")
# if jwt_secret_key_from_env:
#     print(f"DEBUG: JWT_SECRET_KEY loaded from .env: {jwt_secret_key_from_env[:5]}...{jwt_secret_key_from_env[-5:]}")
# else:
#     print("DEBUG: JWT_SECRET_KEY NOT loaded from .env. Using fallback.")

# app = Flask(__name__)

# # --- App Configurations ---
# app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# app.config["JWT_SECRET_KEY"] = jwt_secret_key_from_env or "your_fallback_jwt_secret_key"
# app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

# print(f"DEBUG: app.config['JWT_SECRET_KEY'] is set to: {app.config['JWT_SECRET_KEY'][:5]}...{app.config['JWT_SECRET_KEY'][-5:]}")

# UPLOAD_FOLDER = os.path.join(basedir, "uploads")
# if not os.path.exists(UPLOAD_FOLDER):
#     os.makedirs(UPLOAD_FOLDER)
# app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'zip'}

# # CORS(app, resources={r"/api/*": {
# #     "origins": "*",
# #     "methods": ["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
# #     "headers": ["Content-Type", "Authorization"],
# #     "supports_credentials": True
# # }})
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})

# db.init_app(app)
# migrate = Migrate(app, db)
# jwt = JWTManager(app)

# api_bp = Blueprint('api', __name__, url_prefix='/api')
# api = Api(api_bp)


# # --- Helper Functions ---
# def allowed_file(filename):
#     """Checks if a file's extension is allowed for upload."""
#     return '.' in filename and \
#            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# def admin_required():
#     """Decorator to ensure only admin users can access a route."""
#     def wrapper(fn):
#         @jwt_required()
#         def decorator(*args, **kwargs):
#             current_user_id = get_jwt_identity()
#             current_user = User.get_by_id(current_user_id)
#             if not current_user or (current_user.role and current_user.role.name != 'admin'):
#                 return {"msg": "Administration rights required"}, 403
#             return fn(*args, **kwargs)
#         return decorator
#     return wrapper

# # --- Static File Serving ---
# @app.route('/uploads/<filename>')
# def uploaded_file(filename):
#     """Serves uploaded files from the UPLOAD_FOLDER."""
#     return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# # --- Basic API Home Route ---
# @api_bp.route('/')
# def home():
#     """Home route for the API blueprint."""
#     return {"message": "Welcome To Moringa MarketPlace API"}

# # --- Resources (API Endpoints) ---

# class AuthRegister(Resource):
#     """Handles user registration."""
#     def post(self):
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')
#         username = data.get('username')
#         first_name = data.get('first_name')
#         last_name = data.get('last_name')

#         github = data.get('github')
#         linkedin = data.get('linkedin')
#         skills = data.get('skills')
#         bio = data.get('bio')
#         profile_pic = data.get('profile_pic')

#         if not all([email, password, username, first_name, last_name]):
#             return {"msg": "Email, password, username, first name, and last name are required"}, 400

#         try:
#             if User.get_by_email(email):
#                 return {"msg": "Email already registered"}, 409
#             if User.get_by_username(username):
#                 return {"msg": "Username already taken"}, 409

#             role_name = "user"
#             if email == "samtomashi@moringaschool.com":
#                 role_name = "admin"
#             elif email and "@student.moringaschool.com" in email:
#                 role_name = "student"

#             role = Role.get_by_name(role_name)
#             if not role:
#                 role = Role.create(name=role_name)

#             new_user = User.create(
#                 username=username,
#                 first_name=first_name,
#                 last_name=last_name,
#                 email=email,
#                 password=password,
#                 role_id=role.id,
#                 bio=bio,
#                 profile_pic=profile_pic,
#                 github=github,
#                 linkedin=linkedin,
#                 skills=skills
#             )
#             response_data = new_user.serialize()
#             return response_data, 201

#         except IntegrityError as e:
#             db.session.rollback()
#             print(f"Database Integrity Error during registration: {e}")
#             if "UNIQUE constraint failed" in str(e):
#                 return {"msg": "A user with this email or username already exists."}, 409
#             return {"msg": "Database error during registration. Please try again."}, 500
#         except Exception as e:
#             db.session.rollback()
#             print(f"Unexpected error during registration: {e}")
#             return {"msg": "An unexpected server error occurred during registration."}, 500


# class AuthLogin(Resource):
#     """Handles user login and JWT token generation."""
#     def post(self):
#         data = request.get_json()
#         email = data.get('email')
#         password = data.get('password')

#         if not all([email, password]):
#             return {"msg": "Email and password are required"}, 400

#         user = User.get_by_email(email)
#         if user and user.check_password(password):
#             access_token = create_access_token(identity=str(user.id))
#             refresh_token = create_refresh_token(identity=str(user.id))
#             return {"access_token": access_token, "refresh_token": refresh_token, "role": user.role.name if user.role else "user"}, 200
#         return {"msg": "Invalid credentials"}, 401


# class UserProfile(Resource):
#     """Manages the currently authenticated user's profile."""
#     @jwt_required()
#     def get(self):
#         current_user_id = get_jwt_identity()
#         try:
#             user = User.get_by_id(current_user_id)
#             if not user:
#                 return {"msg": "User profile not found"}, 404
            
#             return {
#                 "id": user.id,
#                 "username": user.username,
#                 "email": user.email,
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "role": user.role.name if user.role else "user",
#                 "bio": user.bio,
#                 "profile_pic": user.profile_pic,
#                 "github": user.github,
#                 "linkedin": user.linkedin,
#                 "skills": user.skills
#             }, 200
#         except Exception as e:
#             db.session.rollback()
#             print(f"Error fetching user profile for ID {current_user_id}: {e}")
#             return {"msg": "An unexpected error occurred while fetching user profile."}, 500

#     @jwt_required()
#     def patch(self):
#         current_user_id = get_jwt_identity()
#         user = User.get_by_id(current_user_id)
#         if not user:
#             return {"msg": "User profile not found"}, 404

#         data = request.get_json()
#         user.update(
#             username=data.get('username', user.username),
#             first_name=data.get('first_name', user.first_name),
#             last_name=data.get('last_name', user.last_name),
#             email=data.get('email', user.email),
#             bio=data.get('bio', user.bio),
#             profile_pic=data.get('profile_pic', user.profile_pic),
#             github=data.get('github', user.github),
#             linkedin=data.get('linkedin', user.linkedin),
#             skills=data.get('skills', user.skills)
#         )
#         return user.serialize(), 200


# class UserProject(Resource):
#     """Manages projects uploaded by the current user."""
#     @jwt_required()
#     def get(self):
#         current_user_id = get_jwt_identity()
#         current_user = User.get_by_id(current_user_id)
#         if not current_user:
#             return {"msg": "User not found"}, 404
#         projects = Project.query.filter_by(uploaded_by=current_user.username).all()
#         return [project.serialize() for project in projects], 200

#     @jwt_required()
#     def delete(self):
#         current_user_id = get_jwt_identity()
#         current_user = User.get_by_id(current_user_id)
#         if not current_user:
#             return {"msg": "User not found"}, 404
#         project_id = request.args.get('project_id')
#         project = Project.get_by_id(project_id)
#         if not project:
#             return {"msg": "Project not found"}, 404
#         if project.uploaded_by != current_user.username:
#             return {"msg": "You are not authorized to delete this project"}, 403
#         project.delete()
#         return {"msg": "Project deleted successfully"}, 204

#     @jwt_required()
#     def patch(self):
#         current_user_id = get_jwt_identity()
#         current_user = User.get_by_id(current_user_id)
#         if not current_user:
#             return {"msg": "User not found"}, 404
#         project_id = request.args.get('project_id')
#         project = Project.get_by_id(project_id)
#         if not project:
#             return {"msg": "Project not found"}, 404
#         if project.uploaded_by != current_user.username:
#             return {"msg": "You are not authorized to update this project"}, 403
#         data = request.get_json()
#         project.update(
#             title=data.get('title', project.title),
#             category=data.get('category', project.category),
#             description=data.get('description', project.description),
#             tech_stack=data.get('tech_stack', project.tech_stack),
#             github_link=data.get('github_link', project.github_link),
#             live_preview_url=data.get('live_preview_url', project.live_preview_url),
#             image_url=data.get('image_url', project.image_url),
#             isForSale=data.get('isForSale', project.isForSale),
#             price=data.get('price', project.price),
#         )
#         return project.serialize(), 200


# class ProjectUpload(Resource):
#     """Handles uploading new projects."""
#     @jwt_required()
#     def post(self):
#         current_user_id = get_jwt_identity()
#         current_user = User.get_by_id(current_user_id)

#         if not current_user:
#             return {"msg": "User not found"}, 404

#         title = request.form.get('title')
        
#         # --- MODIFICATION START ---
#         # Parse collaborators from JSON string
#         collaborators_str = request.form.get('collaborators')
#         try:
#             # Load the JSON string into a Python list of dictionaries
#             collaborators = json.loads(collaborators_str) if collaborators_str else []
#             # Ensure collaborators is a list, even if an empty string or single object was sent
#             if not isinstance(collaborators, list):
#                 collaborators = [collaborators] # Wrap single object in a list if it somehow gets through
#         except json.JSONDecodeError:
#             return {"msg": "Collaborators data is not valid JSON."}, 400
#         # --- MODIFICATION END ---

#         category = request.form.get('category', 'web')
#         description = request.form.get('description')
#         tech_stack = request.form.get('tech_stack', '')
#         github_link = request.form.get('github_link')
#         live_preview_url = request.form.get('live_preview_url', '')
#         image_url = request.form.get('image_url', '')
#         isForSale = request.form.get('isForSale', 'false').lower() == 'true'
#         price = float(request.form.get('price', 0))

#         file_url = None
#         if 'file' in request.files:
#             file = request.files['file']
#             if file.filename != '':
#                 if file and allowed_file(file.filename):
#                     filename = secure_filename(file.filename)
#                     file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#                     file.save(file_path)
#                     file_url = f"/uploads/{filename}"

#         if not all([title, description, github_link]):
#             return {"msg": "Missing required fields (title, description, github_link)"}, 400

#         new_project = Project.create(
#             title=title,
#             category=category,
#             description=description,
#             tech_stack=tech_stack,
#             github_link=github_link,
#             live_preview_url=live_preview_url,
#             image_url=image_url,
#             isForSale=isForSale,
#             collaborators = collaborators, # This will now be a list of dicts
#             price=price,
#             uploaded_by=current_user.username,
#             isApproved=False,
#             status_changed_by=None,
#             file=file_url
#         )

#         UsersProject.create(
#             user_id=current_user_id,
#             project_id=new_project.id,
#             action='uploading'
#         )

#         additional_actions_data = request.form.get('additional_actions_json')
#         if additional_actions_data:
#             try:
#                 actions_list = json.loads(additional_actions_data)
#                 for action_info in actions_list:
#                     member_user_id = action_info.get('user_id')
#                     action_type = action_info.get('action')

#                     if member_user_id and action_type:
#                         target_user = User.get_by_id(member_user_id)
#                         if target_user:
#                             UsersProject.create(
#                                 user_id=member_user_id,
#                                 project_id=new_project.id,
#                                 action=action_type
#                             )
#             except json.JSONDecodeError:
#                 app.logger.warning("Could not parse additional_actions_json")

#         return new_project.serialize(), 201


# class PublicProjects(Resource):
#     """Provides a catalog of public (approved) projects."""
#     def get(self):
#         query = request.args.get('query')
#         category = request.args.get('category')
#         tech_stack = request.args.get('tech_stack')
#         uploaded_by_username = request.args.get('uploaded_by_username')
#         projects = Project.search_and_filter(
#             query=query,
#             category=category,
#             tech_stack=tech_stack,
#             uploaded_by=uploaded_by_username,
#             isApproved=True
#         )
#         return [project.serialize() for project in projects], 200


# class SingleProject(Resource):
#     """Retrieves details for a single project."""
#     def get(self, project_id):
#         project = Project.get_by_id(project_id)
#         if not project:
#             return {"msg": "Project not found"}, 404
#         return project.serialize(), 200


# class AdminUserManagement(Resource):
#     """Allows admin to manage user accounts."""
#     @admin_required()
#     def get(self):
#         users = User.query.all()
#         return [user.serialize() for user in users], 200

#     @admin_required()
#     def patch(self, user_id):
#         user = User.get_by_id(user_id)
#         if not user:
#             return {"msg": "User not found"}, 404

#         data = request.get_json()
#         # Prevent changing role to admin if not already admin
#         if 'role_id' in data:
#             new_role_id = data['role_id']
#             new_role = Role.get_by_id(new_role_id)
#             if new_role and new_role.name == 'admin' and user.role.name != 'admin':
#                 return {"msg": "Cannot directly change role to admin. Only existing admins can assign admin role."}, 403
        
#         user.update(**data)
#         return user.serialize(), 200

#     @admin_required()
#     def delete(self, user_id):
#         user = User.get_by_id(user_id)
#         if not user:
#             return {"msg": "User not found"}, 404
#         # Prevent deleting the last admin
#         if user.role and user.role.name == 'admin':
#             admin_count = User.query.filter(User.role.has(name='admin')).count()
#             if admin_count <= 1:
#                 return {"msg": "Cannot delete the last admin user."}, 403
        
#         user.delete()
#         return {"msg": "User deleted successfully"}, 204


# class AdminProjectManagement(Resource):
#     """Allows admin to manage all projects (approve/reject)."""
#     @admin_required()
#     def get(self):
#         projects = Project.get_all()
#         return [project.serialize() for project in projects], 200

#     @admin_required()
#     def patch(self, project_id):
#         project = Project.get_by_id(project_id)
#         if not project:
#             return {"msg": "Project not found"}, 404

#         data = request.get_json()
        
#         # Capture the admin performing the action
#         current_user_id = get_jwt_identity()
#         admin_user = User.get_by_id(current_user_id)
#         if not admin_user:
#             return {"msg": "Admin user not found"}, 404
        
#         data['status_changed_by'] = admin_user.username # Record which admin made the change

#         project.update(**data)
#         return project.serialize(), 200

#     @admin_required()
#     def delete(self, project_id):
#         project = Project.get_by_id(project_id)
#         if not project:
#             return {"msg": "Project not found"}, 404
#         project.delete()
#         return {"msg": "Project deleted successfully"}, 204


# class AdminMerchandiseManagement(Resource):
#     """Allows admin to manage merchandise."""
#     @admin_required()
#     def get(self):
#         merchandise_items = Merchandise.get_all()
#         return [item.serialize() for item in merchandise_items], 200

#     @admin_required()
#     def post(self):
#         data = request.get_json()
#         name = data.get('name')
#         description = data.get('description')
#         price = data.get('price')
#         image_url = data.get('image_url')
#         stock_quantity = data.get('stock_quantity', 0)
#         category = data.get('category')

#         if not all([name, price is not None, category]):
#             return {"msg": "Name, price, and category are required"}, 400

#         allowed_categories = [
#             'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
#         ]
#         if category.lower() not in allowed_categories:
#             return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400

#         new_merchandise = Merchandise.create(
#             name=name,
#             description=description,
#             price=price,
#             image_url=image_url,
#             stock_quantity=stock_quantity,
#             category=category.lower()
#         )
#         return new_merchandise.serialize(), 201

#     @admin_required()
#     def patch(self, merchandise_id):
#         merchandise = Merchandise.get_by_id(merchandise_id)
#         if not merchandise:
#             return {"msg": "Merchandise item not found"}, 404

#         data = request.get_json()
#         if 'category' in data:
#             allowed_categories = [
#                 'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
#             ]
#             if data['category'].lower() not in allowed_categories:
#                 return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400
#             data['category'] = data['category'].lower()

#         merchandise.update(
#             name=data.get('name', merchandise.name),
#             description=data.get('description', merchandise.description),
#             price=data.get('price', merchandise.price),
#             image_url=data.get('image_url', merchandise.image_url),
#             stock_quantity=data.get('stock_quantity', merchandise.stock_quantity),
#             category=data.get('category', merchandise.category)
#         )
#         return merchandise.serialize(), 200

#     @admin_required()
#     def delete(self, merchandise_id):
#         merchandise = Merchandise.get_by_id(merchandise_id)
#         if not merchandise:
#             return {"msg": "Merchandise item not found"}, 404
#         merchandise.delete()
#         return {"msg": "Merchandise item deleted successfully"}, 204


# class AdminProjectStats(Resource):
#     """Provides statistics for admin dashboard."""
#     @admin_required()
#     def get(self):
#         total_projects = Project.query.count()
#         approved_projects = Project.query.filter_by(isApproved=True).count()
#         pending_projects = Project.query.filter_by(isApproved=False, review_reason=None).count()
#         rejected_projects = Project.query.filter(Project.review_reason.isnot(None)).filter_by(isApproved=False).count()

#         # Assuming Review model exists and has a 'rating' column and a relationship to Project or UsersProject
#         # For average rating, we need to join Reviews with Projects.
#         # This is a simplified example; adjust based on your actual Review model structure.
#         # If Review directly links to Project:
#         # avg_rating_query = db.session.query(db.func.avg(Review.rating)).scalar()

#         # For top projects by reviews, you'd need a join and group by.
#         # This is a placeholder for actual implementation
#         top_projects_by_reviews = [
#             # Example data
#             {"title": "Project Alpha", "review_count": 15},
#             {"title": "Project Beta", "review_count": 12},
#             {"title": "Project Gamma", "review_count": 10},
#         ]
        
#         return {
#             "total_projects": total_projects,
#             "approved_projects": approved_projects,
#             "pending_projects": pending_projects,
#             "rejected_projects": rejected_projects,
#             "average_review_rating": "N/A", # Placeholder until Review logic is refined
#             "top_projects_by_reviews": top_projects_by_reviews # Placeholder
#         }, 200


# class MerchandiseCatalog(Resource):
#     """Provides a catalog of available merchandise."""
#     def get(self):
#         merchandise_items = Merchandise.query.filter(Merchandise.stock_quantity > 0).all()
#         return [item.serialize() for item in merchandise_items], 200


# class UserCart(Resource):
#     """Manages user's shopping cart."""
#     @jwt_required()
#     def get(self):
#         current_user_id = get_jwt_identity()
#         cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
#         if not cart:
#             return {"items": [], "total_amount": 0.0}, 200 # Empty cart

#         cart_items = [item.serialize() for item in cart.order_items]
#         return {"items": cart_items, "total_amount": cart.total_amount}, 200

#     @jwt_required()
#     def post(self):
#         current_user_id = get_jwt_identity()
#         data = request.get_json()
#         merchandise_id = data.get('merchandise_id')
#         quantity = data.get('quantity', 1)

#         if not all([merchandise_id, quantity]):
#             return {"msg": "Merchandise ID and quantity are required"}, 400

#         merchandise = Merchandise.get_by_id(merchandise_id)
#         if not merchandise:
#             return {"msg": "Merchandise item not found"}, 404

#         if merchandise.stock_quantity < quantity:
#             return {"msg": f"Not enough stock for {merchandise.name}. Available: {merchandise.stock_quantity}"}, 400

#         cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
#         if not cart:
#             cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

#         existing_item = OrderItem.query.filter_by(order_id=cart.id, merchandise_id=merchandise_id).first()

#         if existing_item:
#             if merchandise.stock_quantity < (existing_item.quantity + quantity):
#                 return {"msg": f"Adding {quantity} more would exceed stock for {merchandise.name}. Available: {merchandise.stock_quantity - existing_item.quantity}"}, 400
#             existing_item.update(quantity=existing_item.quantity + quantity)
#         else:
#             OrderItem.create(
#                 order_id=cart.id,
#                 merchandise_id=merchandise_id,
#                 quantity=quantity,
#                 price_at_purchase=merchandise.price,
#                 subtotal=merchandise.price * quantity
#             )
        
#         # Recalculate cart total after item addition/update
#         cart.total_amount = sum(item.subtotal for item in cart.order_items)
#         db.session.add(cart)
#         db.session.commit()
#         return cart.serialize(), 200


#     @jwt_required()
#     def patch(self, item_id):
#         current_user_id = get_jwt_identity()
#         order_item = OrderItem.get_by_id(item_id)

#         if not order_item:
#             return {"msg": "Cart item not found"}, 404

#         cart = Order.query.get(order_item.order_id)
#         if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
#             return {"msg": "Unauthorized or cart is not pending"}, 403
        
#         data = request.get_json()
#         new_quantity = data.get('quantity')

#         if new_quantity is None or not isinstance(new_quantity, int) or new_quantity < 0:
#             return {"msg": "Quantity must be a non-negative integer"}, 400
        
#         merchandise = order_item.merchandise
#         if new_quantity > merchandise.stock_quantity:
#             return {"msg": f"Cannot update quantity to {new_quantity}. Only {merchandise.stock_quantity} available."}, 400

#         order_item.update(quantity=new_quantity)
        
#         # If quantity becomes 0, remove the item
#         if new_quantity == 0:
#             order_item.delete()

#         # Recalculate cart total
#         cart.total_amount = sum(item.subtotal for item in cart.order_items)
#         db.session.add(cart)
#         db.session.commit()

#         return cart.serialize(), 200

#     @jwt_required()
#     def delete(self, item_id):
#         current_user_id = get_jwt_identity()
#         order_item = OrderItem.get_by_id(item_id)

#         if not order_item:
#             return {"msg": "Cart item not found"}, 404
        
#         cart = Order.query.get(order_item.order_id)
#         if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
#             return {"msg": "Unauthorized or cart is not pending"}, 403

#         order_item.delete()

#         # Recalculate cart total
#         cart.total_amount = sum(item.subtotal for item in cart.order_items)
#         db.session.add(cart)
#         db.session.commit()

#         return {"msg": "Item removed from cart successfully"}, 200


# class UserOrders(Resource):
#     """Retrieves user's orders."""
#     @jwt_required()
#     def get(self):
#         current_user_id = get_jwt_identity()
#         # Fetch orders that are not pending (i.e., completed payments)
#         orders = Order.query.filter_by(user_id=current_user_id).filter(Order.payment_status != 'Pending').all()
#         return [order.serialize() for order in orders], 200

# # --- Register API Resources with the Blueprint ---
# api.add_resource(AuthRegister, '/auth/register')
# api.add_resource(AuthLogin, '/auth/login')
# api.add_resource(UserProfile, '/users/profile')
# api.add_resource(UserProject, '/users/projects', '/users/projects/<int:project_id>')
# api.add_resource(ProjectUpload, '/projects/upload')
# api.add_resource(PublicProjects, '/projects')
# api.add_resource(SingleProject, '/projects/<int:project_id>')
# api.add_resource(AdminUserManagement, '/admin/users', '/admin/users/<int:user_id>')
# api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>')
# api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>')
# api.add_resource(AdminProjectStats, '/admin/stats/projects')
# api.add_resource(MerchandiseCatalog, '/merchandise')
# api.add_resource(UserCart, '/cart', '/cart/<int:item_id>')
# api.add_resource(UserOrders, '/orders')


# # --- Register the API Blueprint with the Flask App ---
# app.register_blueprint(api_bp)

# # --- Run the Flask App ---
# if __name__ == '__main__':
#     with app.app_context():
#         db.create_all()

#         print("Checking/Seeding roles...")
#         if not Role.get_by_name("admin"):
#             Role.create(name="admin")
#             print("Seeded 'admin' role.")
#         if not Role.get_by_name("student"):
#             Role.create(name="student")
#             print("Seeded 'student' role.")
#         if not Role.get_by_name("user"):
#             Role.create(name="user")
#             print("Seeded 'user' role.")
#         print("Role seeding complete.")

#     app.run(debug=True, port=5555)


##########################################################################################
    # THIS SECOND CODE IS WORKING HOW I WANT IT TO WORK

###########################################################################################
###########################################################################################

# app.py

from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api, Resource
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

# Import Google OAuth blueprint
from google_oauth import google_oauth_bp
import cohere # Added Cohere import

# --- Configuration ---
basedir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(basedir, '.env')

print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
load_dotenv(dotenv_path)

cohere_api_key = os.getenv("COHERE_API_KEY") # Get Cohere API key from .env
client = cohere.Client(cohere_api_key) # Initialize Cohere client

jwt_secret_key_from_env = os.getenv("JWT_SECRET_KEY")
if jwt_secret_key_from_env:
    print(f"DEBUG: JWT_SECRET_KEY loaded from .env: {jwt_secret_key_from_env[:5]}...{jwt_secret_key_from_env[-5:]}")
else:
    print("DEBUG: JWT_SECRET_KEY NOT loaded from .env. Using fallback.")

app = Flask(__name__)

# --- CORS Configuration ---
# Configure CORS with specific origins and settings
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Enable CORS with explicit configuration
cors = CORS(
    app,
    resources={
        r"/*": {
            "origins": CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization", "X-Total-Count"],
        }
    },
    supports_credentials=True
)

# Remove the after_request handler - let Flask-CORS handle all CORS headers

# --- App Configurations ---
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["JWT_SECRET_KEY"] = jwt_secret_key_from_env or "your_fallback_jwt_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

print(f"DEBUG: app.config['JWT_SECRET_KEY'] is set to: {app.config['JWT_SECRET_KEY'][:5]}...{app.config['JWT_SECRET_KEY'][-5:]}")

UPLOAD_FOLDER = os.path.join(basedir, "uploads")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx', 'zip'}

# Configure CORS with specific origins and settings
cors_config = {
    "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
    "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    "allow_headers": [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    "expose_headers": [
        "Content-Range",
        "X-Total-Count",
        "Authorization"
    ],
    "supports_credentials": True,
    "max_age": 600  # Cache preflight request for 10 minutes
}

# Apply CORS to all routes with the same configuration
CORS(
    app,
    resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "supports_credentials": True,
            "allow_headers": ["Content-Type", "Authorization"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    },
    supports_credentials=True
)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

api_bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_bp)


# --- Helper Functions ---
def allowed_file(filename):
    """Checks if a file's extension is allowed for upload."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def admin_required():
    """Decorator to ensure only admin users can access a route."""
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            current_user = User.get_by_id(current_user_id)
            if not current_user or (current_user.role and current_user.role.name != 'admin'):
                return {"msg": "Administration rights required"}, 403
            return fn(*args, **kwargs)
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

# New Chatbot Resource
class Chatbot(Resource):
    def post(self):
        data = request.get_json()
        question = data.get('question')

        if not question:
            return {"answer": "Please provide a question."}, 400

        try:
            response = client.chat(
                message=question,
                model="command",  # Or another suitable Cohere model
                temperature=0.7
            )
            return {"answer": response.text}, 200
        except Exception as e:
            print(f"Cohere API error: {e}")
            return {"answer": "Sorry, I'm having trouble connecting to the chatbot service. Please try again later."}, 500


class AuthRegister(Resource):
    """Handles user registration."""
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        github = data.get('github')
        linkedin = data.get('linkedin')
        skills = data.get('skills')
        bio = data.get('bio')
        profile_pic = data.get('profile_pic')

        if not all([email, password, username, first_name, last_name]):
            return {"msg": "Email, password, username, first name, and last name are required"}, 400

        try:
            if User.get_by_email(email):
                return {"msg": "Email already registered"}, 409
            if User.get_by_username(username):
                return {"msg": "Username already taken"}, 409

            role_name = "user"
            if email == "samtomashi@moringaschool.com":
                role_name = "admin"
            elif email and "@student.moringaschool.com" in email:
                role_name = "student"

            role = Role.get_by_name(role_name)
            if not role:
                role = Role.create(name=role_name)

            new_user = User.create(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=password,
                role_id=role.id,
                bio=bio,
                profile_pic=profile_pic,
                github=github,
                linkedin=linkedin,
                skills=skills
            )
            response_data = new_user.serialize()
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
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            return {"access_token": access_token, "refresh_token": refresh_token, "role": user.role.name if user.role else "user"}, 200
        return {"msg": "Invalid credentials"}, 401


class UserProfile(Resource):
    """Manages the currently authenticated user's profile."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        try:
            user = User.get_by_id(current_user_id)
            if not user:
                return {"msg": "User profile not found"}, 404
            
            return {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role.name if user.role else "user",
                "bio": user.bio,
                "profile_pic": user.profile_pic,
                "github": user.github,
                "linkedin": user.linkedin,
                "skills": user.skills
            }, 200
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
        user.update(
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
        project_id = request.args.get('project_id')
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        if project.uploaded_by != current_user.username:
            return {"msg": "You are not authorized to delete this project"}, 403
        project.delete()
        return {"msg": "Project deleted successfully"}, 204

    @jwt_required()
    def patch(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404
        project_id = request.args.get('project_id')
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        if project.uploaded_by != current_user.username:
            return {"msg": "You are not authorized to update this project"}, 403
        data = request.get_json()
        project.update(
            title=data.get('title', project.title),
            category=data.get('category', project.category),
            description=data.get('description', project.description),
            tech_stack=data.get('tech_stack', project.tech_stack),
            github_link=data.get('github_link', project.github_link),
            live_preview_url=data.get('live_preview_url', project.live_preview_url),
            image_url=data.get('image_url', project.image_url),
            isForSale=data.get('isForSale', project.isForSale),
            price=data.get('price', project.price),
        )
        return project.serialize(), 200


class ProjectUpload(Resource):
    """Handles uploading new projects."""
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)

        if not current_user:
            return {"msg": "User not found"}, 404

        title = request.form.get('title')
        
        # --- MODIFICATION START ---
        # Parse collaborators from JSON string
        collaborators_str = request.form.get('collaborators')
        try:
            # Load the JSON string into a Python list of dictionaries
            collaborators = json.loads(collaborators_str) if collaborators_str else []
            # Ensure collaborators is a list, even if an empty string or single object was sent
            if not isinstance(collaborators, list):
                collaborators = [collaborators] # Wrap single object in a list if it somehow gets through
        except json.JSONDecodeError:
            return {"msg": "Collaborators data is not valid JSON."}, 400
        # --- MODIFICATION END ---

        category = request.form.get('category', 'web')
        description = request.form.get('description')
        tech_stack = request.form.get('tech_stack', '')
        github_link = request.form.get('github_link')
        live_preview_url = request.form.get('live_preview_url', '')
        image_url = request.form.get('image_url', '')
        isForSale = request.form.get('isForSale', 'false').lower() == 'true'
        price = float(request.form.get('price', 0))

        file_url = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename != '':
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(file_path)
                    file_url = f"/uploads/{filename}"

        if not all([title, description, github_link]):
            return {"msg": "Missing required fields (title, description, github_link)"}, 400

        new_project = Project.create(
            title=title,
            category=category,
            description=description,
            tech_stack=tech_stack,
            github_link=github_link,
            live_preview_url=live_preview_url,
            image_url=image_url,
            isForSale=isForSale,
            collaborators = collaborators, # This will now be a list of dicts
            price=price,
            uploaded_by=current_user.username,
            isApproved=False,
            status_changed_by=None,
            file=file_url
        )

        UsersProject.create(
            user_id=current_user_id,
            project_id=new_project.id,
            action='uploading'
        )

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
        query = request.args.get('query')
        category = request.args.get('category')
        tech_stack = request.args.get('tech_stack')
        uploaded_by_username = request.args.get('uploaded_by_username')
        projects = Project.search_and_filter(
            query=query,
            category=category,
            tech_stack=tech_stack,
            uploaded_by=uploaded_by_username,
            isApproved=True
        )
        return [project.serialize() for project in projects], 200


class SingleProject(Resource):
    """Retrieves details for a single project."""
    def get(self, project_id):
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        return project.serialize(), 200


class AdminUserManagement(Resource):
    """Allows admin to manage user accounts."""
    @admin_required()
    def get(self):
        users = User.query.all()
        return [user.serialize() for user in users], 200

    @admin_required()
    def patch(self, user_id):
        user = User.get_by_id(user_id)
        if not user:
            return {"msg": "User not found"}, 404

        data = request.get_json()
        # Prevent changing role to admin if not already admin
        if 'role_id' in data:
            new_role_id = data['role_id']
            new_role = Role.get_by_id(new_role_id)
            if new_role and new_role.name == 'admin' and user.role.name != 'admin':
                return {"msg": "Cannot directly change role to admin. Only existing admins can assign admin role."}, 403
        
        user.update(**data)
        return user.serialize(), 200

    @admin_required()
    def delete(self, user_id):
        user = User.get_by_id(user_id)
        if not user:
            return {"msg": "User not found"}, 404
        # Prevent deleting the last admin
        if user.role and user.role.name == 'admin':
            admin_count = User.query.filter(User.role.has(name='admin')).count()
            if admin_count <= 1:
                return {"msg": "Cannot delete the last admin user."}, 403
        
        user.delete()
        return {"msg": "User deleted successfully"}, 204


class AdminProjectManagement(Resource):
    """Allows admin to manage all projects (approve/reject)."""
    @admin_required()
    def get(self):
        projects = Project.get_all()
        return [project.serialize() for project in projects], 200

    @admin_required()
    def patch(self, project_id):
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404

        data = request.get_json()
        
        # Capture the admin performing the action
        current_user_id = get_jwt_identity()
        admin_user = User.get_by_id(current_user_id)
        if not admin_user:
            return {"msg": "Admin user not found"}, 404
        
        data['status_changed_by'] = admin_user.username # Record which admin made the change

        project.update(**data)
        return project.serialize(), 200

    @admin_required()
    def delete(self, project_id):
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        project.delete()
        return {"msg": "Project deleted successfully"}, 204


class AdminMerchandiseManagement(Resource):
    """Allows admin to manage merchandise."""
    @admin_required()
    def get(self):
        merchandise_items = Merchandise.get_all()
        return [item.serialize() for item in merchandise_items], 200

    @admin_required()
    def post(self):
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        image_url = data.get('image_url')
        stock_quantity = data.get('stock_quantity', 0)
        category = data.get('category')

        if not all([name, price is not None, category]):
            return {"msg": "Name, price, and category are required"}, 400

        allowed_categories = [
            'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
        ]
        if category.lower() not in allowed_categories:
            return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400

        new_merchandise = Merchandise.create(
            name=name,
            description=description,
            price=price,
            image_url=image_url,
            stock_quantity=stock_quantity,
            category=category.lower()
        )
        return new_merchandise.serialize(), 201

    @admin_required()
    def patch(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        data = request.get_json()
        if 'category' in data:
            allowed_categories = [
                'electronics', 'accessories', 'footwear', 'clothing', 'home', 'health', 'defense'
            ]
            if data['category'].lower() not in allowed_categories:
                return {"msg": f"Invalid category. Allowed categories: {', '.join(allowed_categories)}"}, 400
            data['category'] = data['category'].lower()

        merchandise.update(
            name=data.get('name', merchandise.name),
            description=data.get('description', merchandise.description),
            price=data.get('price', merchandise.price),
            image_url=data.get('image_url', merchandise.image_url),
            stock_quantity=data.get('stock_quantity', merchandise.stock_quantity),
            category=data.get('category', merchandise.category)
        )
        return merchandise.serialize(), 200

    @admin_required()
    def delete(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404
        merchandise.delete()
        return {"msg": "Merchandise item deleted successfully"}, 204


class AdminProjectStats(Resource):
    """Provides statistics for admin dashboard."""
    @admin_required()
    def get(self):
        total_projects = Project.query.count()
        approved_projects = Project.query.filter_by(isApproved=True).count()
        pending_projects = Project.query.filter_by(isApproved=False, review_reason=None).count()
        rejected_projects = Project.query.filter(Project.review_reason.isnot(None)).filter_by(isApproved=False).count()

        # Assuming Review model exists and has a 'rating' column and a relationship to Project or UsersProject
        # For average rating, we need to join Reviews with Projects.
        # This is a simplified example; adjust based on your actual Review model structure.
        # If Review directly links to Project:
        # avg_rating_query = db.session.query(db.func.avg(Review.rating)).scalar()

        # For top projects by reviews, you'd need a join and group by.
        # This is a placeholder for actual implementation
        top_projects_by_reviews = [
            # Example data
            {"title": "Project Alpha", "review_count": 15},
            {"title": "Project Beta", "review_count": 12},
            {"title": "Project Gamma", "review_count": 10},
        ]
        
        return {
            "total_projects": total_projects,
            "approved_projects": approved_projects,
            "pending_projects": pending_projects,
            "rejected_projects": rejected_projects,
            "average_review_rating": "N/A", # Placeholder until Review logic is refined
            "top_projects_by_reviews": top_projects_by_reviews # Placeholder
        }, 200


class MerchandiseCatalog(Resource):
    """Provides a catalog of available merchandise."""
    def get(self):
        merchandise_items = Merchandise.query.filter(Merchandise.stock_quantity > 0).all()
        return [item.serialize() for item in merchandise_items], 200


class UserCart(Resource):
    """Manages user's shopping cart."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"items": [], "total_amount": 0.0}, 200 # Empty cart

        cart_items = [item.serialize() for item in cart.order_items]
        return {"items": cart_items, "total_amount": cart.total_amount}, 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        merchandise_id = data.get('merchandise_id')
        quantity = data.get('quantity', 1)

        if not all([merchandise_id, quantity]):
            return {"msg": "Merchandise ID and quantity are required"}, 400

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
            OrderItem.create(
                order_id=cart.id,
                merchandise_id=merchandise_id,
                quantity=quantity,
                price_at_purchase=merchandise.price,
                subtotal=merchandise.price * quantity
            )
        
        # Recalculate cart total after item addition/update
        cart.total_amount = sum(item.subtotal for item in cart.order_items)
        db.session.add(cart)
        db.session.commit()
        return cart.serialize(), 200


    @jwt_required()
    def patch(self, item_id):
        current_user_id = get_jwt_identity()
        order_item = OrderItem.get_by_id(item_id)

        if not order_item:
            return {"msg": "Cart item not found"}, 404

        cart = Order.query.get(order_item.order_id)
        if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
            return {"msg": "Unauthorized or cart is not pending"}, 403
        
        data = request.get_json()
        new_quantity = data.get('quantity')

        if new_quantity is None or not isinstance(new_quantity, int) or new_quantity < 0:
            return {"msg": "Quantity must be a non-negative integer"}, 400
        
        merchandise = order_item.merchandise
        if new_quantity > merchandise.stock_quantity:
            return {"msg": f"Cannot update quantity to {new_quantity}. Only {merchandise.stock_quantity} available."}, 400

        order_item.update(quantity=new_quantity)
        
        # If quantity becomes 0, remove the item
        if new_quantity == 0:
            order_item.delete()

        # Recalculate cart total
        cart.total_amount = sum(item.subtotal for item in cart.order_items)
        db.session.add(cart)
        db.session.commit()

        return cart.serialize(), 200

    @jwt_required()
    def delete(self, item_id):
        current_user_id = get_jwt_identity()
        order_item = OrderItem.get_by_id(item_id)

        if not order_item:
            return {"msg": "Cart item not found"}, 404
        
        cart = Order.query.get(order_item.order_id)
        if not cart or cart.user_id != current_user_id or cart.payment_status != 'Pending':
            return {"msg": "Unauthorized or cart is not pending"}, 403

        order_item.delete()

        # Recalculate cart total
        cart.total_amount = sum(item.subtotal for item in cart.order_items)
        db.session.add(cart)
        db.session.commit()

        return {"msg": "Item removed from cart successfully"}, 200


class UserOrders(Resource):
    """Retrieves user's orders."""
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        # Fetch orders that are not pending (i.e., completed payments)
        orders = Order.query.filter_by(user_id=current_user_id).filter(Order.payment_status != 'Pending').all()
        return [order.serialize() for order in orders], 200

# --- Register Blueprints ---
app.register_blueprint(google_oauth_bp, url_prefix='')

# --- Register API Resources with the Blueprint ---
api.add_resource(Chatbot, '/ask') # Registered the new Chatbot resource
api.add_resource(AuthRegister, '/auth/register')
api.add_resource(AuthLogin, '/auth/login')
api.add_resource(UserProfile, '/users/profile')
api.add_resource(UserProject, '/users/projects', '/users/projects/<int:project_id>')
api.add_resource(ProjectUpload, '/projects/upload')
api.add_resource(PublicProjects, '/projects')
api.add_resource(SingleProject, '/projects/<int:project_id>')
api.add_resource(AdminUserManagement, '/admin/users', '/admin/users/<int:user_id>')
api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>')
api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>')
api.add_resource(AdminProjectStats, '/admin/stats/projects')
api.add_resource(MerchandiseCatalog, '/merchandise')
api.add_resource(UserCart, '/cart', '/cart/<int:item_id>')
api.add_resource(UserOrders, '/orders')


# --- Register the API Blueprint with the Flask App ---
app.register_blueprint(api_bp)

# --- Run the Flask App ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

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

    app.run(debug=True, port=5555)

    # THIS SECOND CODE IS WORKING HOW I WANT IT TO WORK

    ###########################################################################################
    ###########################################################################################
































































































































































































































































































































































































from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api, Resource

from models import db, Student, Project, User, Merchandise, Review, Company, Order, OrderItem, ContactRequest, TeamProject
import os
import json 
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError 

from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


basedir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(basedir, '.env')

print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
load_dotenv(dotenv_path)

print(f"DEBUG: os.getenv('JWT_SECRET_KEY') after load_dotenv(): {os.getenv('JWT_SECRET_KEY')}")

app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_fallback_jwt_secret_key") 


UPLOAD_FOLDER = os.path.join(basedir, "uploads") 
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app) 


api_bp = Blueprint('api', __name__, url_prefix='/api')
api = Api(api_bp) 


def allowed_file(filename):
    return '.' in filename and \
    filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def admin_required():
    def wrapper(fn):
        @jwt_required()
        def decorator(*args, **kwargs):
            current_user_id = get_jwt_identity()
            current_user = User.get_by_id(current_user_id)
            if not current_user or current_user.role != 'admin':
                return {"msg": "Administration rights required"}, 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



@api_bp.route('/')
def home():
    return {"message": "Welcome To Moringa MarketPlace API"}



class AuthRegister(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name') 

        if not all([email, password, name]):
            return {"msg": "Email, password, and name are required"}, 400

        try:
            new_entity = None
            role = None

            
            if "@student.moringaschool.com" in email:
                if Student.get_by_email(email):
                    return {"msg": "Student email already registered"}, 409
                new_entity = Student.create(
                    name=name,
                    email=email,
                    password=password,
                    github=data.get('github'),
                    linkedin=data.get('linkedin'),
                    skills=data.get('skills')
                )
                role = "student"
            elif "@admin.moringaschool.com" in email:
                if User.get_by_email(email):
                    return {"msg": "Admin email already registered"}, 409

                
                base_username = name.replace(" ", "").lower()
                username = base_username
                counter = 1
                while User.get_by_username(username):
                    username = f"{base_username}{counter}"
                    counter += 1

                
                name_parts = name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else '.' 

                new_entity = User.create(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=password,
                    role="admin"
                )
                role = "admin"
            else:
                if User.get_by_email(email):
                    return {"msg": "User email already registered"}, 409

                
                base_username = name.replace(" ", "").lower()
                username = base_username
                counter = 1
                while User.get_by_username(username):
                    username = f"{base_username}{counter}"
                    counter += 1

                
                name_parts = name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else '.' 

                new_entity = User.create(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    password=password,
                    role="user"
                )
                role = "user"

            
            if new_entity is None:
                return {"msg": "Registration failed due to an unknown issue."}, 500

            response_data = new_entity.serialize()
            response_data['role'] = role
            return response_data, 201

        except IntegrityError as e:
            db.session.rollback() 
            print(f"Database Integrity Error: {e}")
            
            if "UNIQUE constraint failed" in str(e):
                return {"msg": "A user with this email or username already exists."}, 409
            return {"msg": "Database error during registration. Please try again."}, 400
        except Exception as e:
            db.session.rollback() 
            print(f"Unexpected error during registration: {e}") 
            return {"msg": "An unexpected error occurred during registration."}, 500


class AuthLogin(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return {"msg": "Email and password are required"}, 400

        user_id = None
        user_role = None

        
        user = User.get_by_email(email)
        if user and user.check_password(password):
            user_id = user.id
            user_role = user.role
        else:
            
            student = Student.get_by_email(email)
            if student and student.check_password(password):
                user_id = student.id
                user_role = "student" 

        if user_id and user_role:
            access_token = create_access_token(identity=user_id)
            refresh_token = create_refresh_token(identity=user_id)
            return {"access_token": access_token, "refresh_token": refresh_token, "role": user_role}, 200
        return {"msg": "Invalid credentials"}, 401


class StudentProfile(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        try:
            student = Student.get_by_id(current_user_id)
            if not student:
                return {"msg": "Student profile not found or you are not a student"}, 404
            return student.serialize(), 200
        except Exception as e:
            
            db.session.rollback() 
            print(f"Error fetching student profile for ID {current_user_id}: {e}") # Print the actual error
            return {"msg": "An unexpected error occurred while fetching student profile."}, 500


    @jwt_required()
    def patch(self):
        current_user_id = get_jwt_identity()
        student = Student.get_by_id(current_user_id)
        if not student:
            return {"msg": "Student profile not found or you are not a student"}, 404

        data = request.get_json()
        student.update(
            name=data.get('name'),
            email=data.get('email'),
            github=data.get('github'),
            linkedin=data.get('linkedin'),
            skills=data.get('skills') 
        )
        return student.serialize(), 200

class StudentProjects(Resource):
    @jwt_required()
    def get(self):
        current_student_id = get_jwt_identity() 
        projects = Project.query.filter_by(student_id=current_student_id).all()
        return jsonify([project.serialize() for project in projects]), 200

    @jwt_required()
    def delete(self):
        current_student_id = get_jwt_identity()
        project_id = request.args.get('project_id')

        if not project_id:
            return {"msg": "Project ID is required as a query parameter"}, 400

        project = Project.query.filter_by(id=project_id, student_id=current_student_id).first()
        if not project:
            return {"msg": "Project not found or you don't have permission to delete it"}, 404

        project.delete()
        return {"msg": "Project deleted"}, 200

class ProjectUpload(Resource):
    @jwt_required()
    def post(self):
        current_student_id = get_jwt_identity() 
        title = request.form.get('title')
        category = request.form.get('category')
        description = request.form.get('description')
        github_link = request.form.get('githubLink')
        demo_link = request.form.get('demoLink')
        for_sale = request.form.get('forSale', 'false').lower() == 'true'
        price = float(request.form.get('price', 0))

        if not all([title, category, description, github_link]):
            return {"msg": "Missing required project fields"}, 400

        file_url = None
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return {"msg": "No selected file" }, 400

            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                file_url = f"/uploads/{filename}"

        new_project = Project.create(
            title=title,
            category=category,
            description=description,
            github_link=github_link,
            demo_link=demo_link,
            for_sale=for_sale,
            price=price,
            file_url=file_url,
            student_id=current_student_id
        )

        
        team_members_data = request.form.get('team_members_json')
        if team_members_data:
            try:
                team_members_list = json.loads(team_members_data)
                for member_info in team_members_list:
                    member_id = member_info.get('student_id')
                    member_role = member_info.get('role', 'Member')
                    if member_id:
                        
                        if Student.get_by_id(member_id) and member_id != current_student_id:
                            new_project.add_team_member(member_id, member_role)
                        else:
                            print(f"Warning: Invalid or duplicate student_id {member_id} for team member addition.")
            except json.JSONDecodeError:
                print("Warning: Could not parse team_members_json. Skipping team member addition.")


        return new_project.serialize(), 201

class PublicProjects(Resource):
    def get(self):
        
        query = request.args.get('query')
        category = request.args.get('category')
        technology = request.args.get('technology')
        student_name = request.args.get('student_name')

        projects = Project.search_and_filter(
            query=query,
            category=category,
            technology=technology,
            student_name=student_name,
            status="Approved" 
        )
        return jsonify([project.serialize() for project in projects]), 200

class SingleProject(Resource):
    def get(self, project_id):
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        return project.serialize(), 200



class AdminProjectManagement(Resource):
    @admin_required()
    def get(self):
        """Get all projects for admin review (pending, approved, rejected)."""
        projects = Project.get_all()
        return jsonify([project.serialize() for project in projects]), 200

    @admin_required()
    def patch(self, project_id):
        """Approve or reject a project."""
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404

        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ["Approved", "Rejected", "Pending"]:
            return {"msg": "Invalid status provided. Must be 'Approved', 'Rejected', or 'Pending'"}, 400

        project.update(status=new_status)
        return project.serialize(), 200

class AdminMerchandiseManagement(Resource):
    @admin_required()
    def get(self):
        """Get all merchandise items."""
        merchandise_items = Merchandise.get_all()
        return jsonify([item.serialize() for item in merchandise_items]), 200

    @admin_required()
    def post(self):
        """Create a new merchandise item."""
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        image_url = data.get('image_url')

        if not all([name, price is not None]):
            return {"msg": "Name and price are required"}, 400

        new_merchandise = Merchandise.create(
            name=name,
            description=description,
            price=price,
            image_url=image_url
        )
        return new_merchandise.serialize(), 201

    @admin_required()
    def patch(self, merchandise_id):
        """Update an existing merchandise item."""
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        data = request.get_json()
        merchandise.update(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            image_url=data.get('image_url')
        )
        return merchandise.serialize(), 200

    @admin_required()
    def delete(self, merchandise_id):
        """Delete a merchandise item."""
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        merchandise.delete()
        return {"msg": "Merchandise item deleted"}, 200

class AdminProjectStats(Resource):
    @admin_required()
    def get(self):
        """Get project engagement statistics."""
        total_projects = Project.query.count()
        approved_projects = Project.query.filter_by(status="Approved").count()
        pending_projects = Project.query.filter_by(status="Pending").count()
        rejected_projects = Project.query.filter_by(status="Rejected").count()

        # Calculate average rating
        avg_rating_result = db.session.query(db.func.avg(Review.rating)).scalar()
        average_rating = round(avg_rating_result, 2) if avg_rating_result else 0.0

        # Get projects with most reviews (top 5)
        top_projects_by_reviews = db.session.query(
            Project.title,
            db.func.count(Review.id).label('review_count')
        ).join(Review).group_by(Project.id).order_by(db.desc('review_count')).limit(5).all()

        return jsonify({
            "total_projects": total_projects,
            "approved_projects": approved_projects,
            "pending_projects": pending_projects,
            "rejected_projects": rejected_projects,
            "average_review_rating": average_rating,
            "top_projects_by_reviews": [{"title": p.title, "review_count": p.review_count} for p in top_projects_by_reviews]
        }), 200



class MerchandiseCatalog(Resource):
    def get(self):
        """Get all merchandise items for public display."""
        merchandise_items = Merchandise.get_all()
        return jsonify([item.serialize() for item in merchandise_items]), 200

class UserCart(Resource):
    @jwt_required()
    def get(self):
        """Get the current user's pending order (shopping cart)."""
        current_user_id = get_jwt_identity()
        
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"msg": "Cart is empty. Add items to create a cart."}, 200 

        return cart.serialize(), 200

    @jwt_required()
    def post(self):
        """Add an item to the user's shopping cart."""
        current_user_id = get_jwt_identity()
        data = request.get_json()
        merchandise_id = data.get('merchandise_id')
        quantity = data.get('quantity', 1)

        if not all([merchandise_id, quantity > 0]):
            return {"msg": "Merchandise ID and a valid quantity are required"}, 400

        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

        
        existing_item = OrderItem.query.filter_by(order_id=cart.id, merchandise_id=merchandise_id).first()
        if existing_item:
            existing_item.update(quantity=existing_item.quantity + quantity)
        else:
            cart.add_item(merchandise.id, quantity, merchandise.price) 

        return cart.serialize(), 200

    @jwt_required()
    def patch(self, item_id):
        """Update the quantity of an item in the user's shopping cart."""
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

        if new_quantity == 0:
            item.delete() 
        else:
            item.update(quantity=new_quantity)

        
        db.session.refresh(cart)
        return cart.serialize(), 200

    @jwt_required()
    def delete(self, item_id):
        """Remove an item from the user's shopping cart."""
        current_user_id = get_jwt_identity()

        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            return {"msg": "No active cart found"}, 404

        item = OrderItem.get_by_id(item_id)
        if not item or item.order_id != cart.id:
            return {"msg": "Item not found in your cart"}, 404

        item.delete() 
        db.session.refresh(cart) 

        return {"msg": "Item removed from cart", "cart": cart.serialize()}, 200

class UserOrders(Resource):
    @jwt_required()
    def get(self):
        """Get the current user's order history (completed orders)."""
        current_user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=current_user_id).filter(Order.payment_status != 'Pending').all()
        return jsonify([order.serialize() for order in orders]), 200

    @jwt_required()
    def post(self):
        """Finalize the current user's pending order (checkout)."""
        current_user_id = get_jwt_identity()
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()

        if not cart or not cart.items:
            return {"msg": "No items in cart to checkout"}, 400

        ## Later implement maneno ya Mpesa or Stripe
        ## usisahau wakuu
        
        cart.update(payment_status='Completed')
        

        return {"msg": "Order placed successfully", "order": cart.serialize()}, 200



class ContactForm(Resource):
    @jwt_required()
    def post(self):
        """Allows an authenticated user to submit a contact request to a company."""
        current_user_id = get_jwt_identity() 
        data = request.get_json()
        company_id = data.get('company_id')
        message = data.get('message')

        if not all([company_id, message]):
            return {"msg": "Company ID and message are required"}, 400

        company = Company.get_by_id(company_id)
        if not company:
            return {"msg": "Company not found"}, 404

        
        user_email = None
        user = User.get_by_id(current_user_id)
        if user:
            user_email = user.email
        else: 
            student = Student.get_by_id(current_user_id)
            if student:
                user_email = student.email

        if not user_email:
            return {"msg": "Could not determine sender's email. Ensure you are logged in as a valid user or student."}, 400

        try:
            contact_request = ContactRequest.create(
                company_id=company_id,
                email=user_email,
                message=message
            )
            return contact_request.serialize(), 201
        except IntegrityError as e:
            db.session.rollback()
            print(f"Database Integrity Error during contact request: {e}")
            return {"msg": "Failed to submit contact request due to a database error."}, 400
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error during contact request: {e}")
            return {"msg": "An unexpected error occurred while submitting contact request."}, 500


class ProjectPurchase(Resource):
    @jwt_required()
    def post(self, project_id):
        """Allows an authenticated user to purchase a project if it's for sale."""
        current_user_id = get_jwt_identity()
        project = Project.get_by_id(project_id)

        if not project:
            return {"msg": "Project not found"}, 404
        if not project.for_sale:
            return {"msg": "This project is not marked for sale"}, 400
        if project.price <= 0:
            return {"msg": "Project has no valid price for purchase"}, 400

        
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

        # Maybe twist around the tables baadaye
        # 1. A dedicated 'ProjectOrder' model.
        # 2. A polymorphic 'OrderItem' that can link to either Merchandise or Project.
        # 3. A special 'Merchandise' entry representing "Project Purchase" items.
        project_item_id = -project.id # Using negative project ID to avoid conflict with merchandise IDs

        existing_project_item = OrderItem.query.filter_by(
            order_id=cart.id,
            merchandise_id=project_item_id
        ).first()

        if existing_project_item:
            return {"msg": "Project already in your cart. Proceed to checkout."}, 409
        else:
            try:
                
                cart.add_item(merchandise_id=project_item_id, quantity=1, unit_price=project.price)
                return {"msg": "Project added to cart. Proceed to checkout.", "cart": cart.serialize()}, 200
            except IntegrityError as e:
                db.session.rollback()
                print(f"Database Integrity Error adding project to cart: {e}")
                return {"msg": "Failed to add project to cart due to a database error."}, 400
            except Exception as e:
                db.session.rollback()
                print(f"Unexpected error adding project to cart: {e}")
                return {"msg": "An unexpected error occurred while adding project to cart."}, 500


class ProjectReviews(Resource):
    @jwt_required()
    def get(self, project_id):
        """Get all reviews for a specific project."""
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        reviews = Review.get_by_project_id(project_id)
        return jsonify([review.serialize() for review in reviews]), 200

    @jwt_required()
    def post(self, project_id):
        """Submit a new review for a specific project."""
        current_user_id = get_jwt_identity()
        data = request.get_json()
        rating = data.get('rating')
        comment = data.get('comment')

        if not all([rating is not None, 1 <= rating <= 5]):
            return {"msg": "Rating (1-5) is required"}, 400

        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404

        existing_review = Review.query.filter_by(project_id=project_id, reviewer_id=current_user_id).first()
        if existing_review:
            return {"msg": "You have already submitted a review for this project. Use PATCH to update."}, 409

        try:
            new_review = Review.create(
                project_id=project_id,
                reviewer_id=current_user_id,
                rating=rating,
                comment=comment
            )
            return new_review.serialize(), 201
        except IntegrityError as e:
            db.session.rollback()
            print(f"Database Integrity Error submitting review: {e}")
            return {"msg": "Failed to submit review due to a database error."}, 400
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error submitting review: {e}")
            return {"msg": "An unexpected error occurred while submitting review."}, 500


    @jwt_required()
    def patch(self, project_id, review_id):
        """Update an existing review for a specific project."""
        current_user_id = get_jwt_identity()
        review = Review.get_by_id(review_id)

        if not review or review.project_id != project_id or review.reviewer_id != current_user_id:
            return {"msg": "Review not found or you don't have permission to update it"}, 404

        data = request.get_json()
        rating = data.get('rating')
        comment = data.get('comment')

        if rating is not None and not (1 <= rating <= 5):
            return {"msg": "Rating must be between 1 and 5"}, 400

        try:
            review.update(rating=rating, comment=comment)
            return review.serialize(), 200
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error updating review: {e}")
            return {"msg": "An unexpected error occurred while updating review."}, 500


    @jwt_required()
    def delete(self, project_id, review_id):
        """Delete a review for a specific project."""
        current_user_id = get_jwt_identity()
        review = Review.get_by_id(review_id)

        if not review or review.project_id != project_id or review.reviewer_id != current_user_id:
            return {"msg": "Review not found or you don't have permission to delete it"}, 404

        try:
            review.delete()
            return {"msg": "Review deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error deleting review: {e}")
            return {"msg": "An unexpected error occurred while deleting review."}, 500


# --- Registering Flask-RESTful Resources ---
api.add_resource(AuthRegister, '/register')
api.add_resource(AuthLogin, '/login')
# api.add_resource(Students, '/students') 
api.add_resource(StudentProfile, '/me')
api.add_resource(StudentProjects, '/me/projects')
api.add_resource(ProjectUpload, '/projects/upload')
api.add_resource(PublicProjects, '/projects')
api.add_resource(SingleProject, '/projects/<int:project_id>')

# Admin Endpoints
api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>')
api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>')
api.add_resource(AdminProjectStats, '/admin/stats/projects')

# E-commerce Endpoints
api.add_resource(MerchandiseCatalog, '/merchandise')
api.add_resource(UserCart, '/cart', '/cart/<int:item_id>')
api.add_resource(UserOrders, '/orders')

# New Endpoints for Core Requirements
api.add_resource(ContactForm, '/contact-requests') # For submitting contact requests
api.add_resource(ProjectPurchase, '/projects/<int:project_id>/purchase') # For purchasing projects
api.add_resource(ProjectReviews, '/projects/<int:project_id>/reviews', '/projects/<int:project_id>/reviews/<int:review_id>') # For managing project reviews

# Register the Blueprint with the Flask app
app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
