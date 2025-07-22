from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api, Resource
# Corrected import statement: Removed Student, Company, ContactRequest, TeamProject
from models import db, User, Role, Project, UsersProject, Review, Merchandise, Order, OrderItem
import os
import json
from flask_cors import CORS
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
from datetime import timedelta
from werkzeug.utils import secure_filename
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity


basedir = os.path.abspath(os.path.dirname(__file__))
dotenv_path = os.path.join(basedir, '.env')

print(f"DEBUG: Attempting to load .env from: {dotenv_path}")
load_dotenv(dotenv_path)

jwt_secret_key_from_env = os.getenv("JWT_SECRET_KEY")
if jwt_secret_key_from_env:
    print(f"DEBUG: JWT_SECRET_KEY loaded from .env: {jwt_secret_key_from_env[:5]}...{jwt_secret_key_from_env[-5:]}")
else:
    print("DEBUG: JWT_SECRET_KEY NOT loaded from .env. Using fallback.")

app = Flask(__name__)
CORS(app)


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///moringa_marketplace.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


app.config["JWT_SECRET_KEY"] = jwt_secret_key_from_env or "your_fallback_jwt_secret_key"
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)

print(f"DEBUG: app.config['JWT_SECRET_KEY'] is set to: {app.config['JWT_SECRET_KEY'][:5]}...{app.config['JWT_SECRET_KEY'][-5:]}")


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
            if not current_user or (current_user.role and current_user.role.name != 'admin'):
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
            if "@student.moringaschool.com" in email:
                role_name = "student"
            elif "@admin.moringaschool.com" in email:
                role_name = "admin"
            
            # Fetch role object
            role = Role.get_by_name(role_name)
            if not role:
                # Create role if it doesn't exist (e.g., first time 'student' or 'admin' registers)
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

        user = User.get_by_email(email)
        if user and user.check_password(password):
            access_token = create_access_token(identity=str(user.id))
            refresh_token = create_refresh_token(identity=str(user.id))
            return {"access_token": access_token, "refresh_token": refresh_token, "role": user.role.name if user.role else "user"}, 200
        return {"msg": "Invalid credentials"}, 401

# --- User Profile Management (for logged-in user) ---

class UserProfile(Resource):
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
        # Only allow updating specific fields
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

# --- Project Management (for logged-in user) ---

class UserProject(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404

        # Projects uploaded by the current user (using the string 'uploaded_by' field)
        projects = Project.query.filter_by(uploaded_by=current_user.username).all()
        return [project.serialize() for project in projects], 200

    @jwt_required()
    def delete(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404

        project_id = request.args.get('project_id')

        if not project_id:
            return {"msg": "Project ID is required as a query parameter"}, 400

        # Ensure only the uploader (by username string) can delete their project
        project = Project.query.filter_by(id=project_id, uploaded_by=current_user.username).first()
        if not project:
            return {"msg": "Project not found or you don't have permission to delete it"}, 404

        project.delete()
        return {"msg": "Project deleted"}, 200

class ProjectUpload(Resource):
    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        current_user = User.get_by_id(current_user_id)
        if not current_user:
            return {"msg": "User not found"}, 404
        data = request.get_json()
        
        title = data.get('title')
        category = data.get('category')
        description = data.get('description')
        tech_stack = data.get('tech_stack')
        github_link = data.get('github_link')
        live_preview_url = data.get('live_preview_url')
        isForSale = data.get('isForSale', 'false').lower() == 'true'
        price = float(data.get('price', 0))

        if not all([title, category, description, github_link]):
            return {"msg": "Missing required project fields (title, category, description, github_link)"}, 400

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
            tech_stack=tech_stack,
            github_link=github_link,
            live_preview_url=live_preview_url,
            isForSale=isForSale,
            price=price,
            uploaded_by=current_user.username, # Use username string
            isApproved=False, # Projects start as pending approval
            status_changed_by=None # No one has approved it yet
        )

        # Log the 'uploading' action in UsersProject
        UsersProject.create(user_id=current_user_id, project_id=new_project.id, action='uploading')

        # Handle additional team members/actions if provided
        additional_actions_data = request.form.get('additional_actions_json')
        if additional_actions_data:
            try:
                actions_list = json.loads(additional_actions_data)
                for action_info in actions_list:
                    member_user_id = action_info.get('user_id')
                    action_type = action_info.get('action') # e.g., 'commenting', 'liking', 'collaborating'
                    
                    if member_user_id and action_type:
                        target_user = User.get_by_id(member_user_id)
                        if target_user:
                            
                            UsersProject.create(user_id=member_user_id, project_id=new_project.id, action=action_type)
                        else:
                            print(f"Warning: User with ID {member_user_id} not found for additional action.")
            except json.JSONDecodeError:
                print("Warning: Could not parse additional_actions_json. Skipping.")

        return new_project.serialize(), 201

class PublicProjects(Resource):
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
    def get(self, project_id):
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        return project.serialize(), 200

# --- Admin Panel Resources ---

class AdminProjectManagement(Resource):
    @admin_required()
    def get(self):
        projects = Project.get_all()
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
        
        if is_approved is None or not isinstance(is_approved, bool):
            return {"msg": "Invalid 'isApproved' status. Must be true or false."}, 400

        
        status_changer_name = current_admin.username
        
        project.update(isApproved=is_approved, status_changed_by=status_changer_name)

        
        action_type = 'approving' if is_approved else 'rejecting'
        
        existing_action = UsersProject.get_by_user_and_project(current_admin_id, project_id, action_type)
        if not existing_action:
            UsersProject.create(user_id=current_admin_id, project_id=project_id, action=action_type)
        else:
            
            existing_action.update(updated_at=datetime.now())


        return project.serialize(), 200

class AdminMerchandiseManagement(Resource):
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

        if not all([name, price is not None]):
            return {"msg": "Name and price are required"}, 400

        new_merchandise = Merchandise.create(
            name=name,
            description=description,
            price=price,
            image_url=image_url,
            stock_quantity=stock_quantity
        )
        return new_merchandise.serialize(), 201

    @admin_required()
    def patch(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        data = request.get_json()
        merchandise.update(
            name=data.get('name'),
            description=data.get('description'),
            price=data.get('price'),
            image_url=data.get('image_url'),
            stock_quantity=data.get('stock_quantity')
        )
        return merchandise.serialize(), 200

    @admin_required()
    def delete(self, merchandise_id):
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            return {"msg": "Merchandise item not found"}, 404

        merchandise.delete()
        return {"msg": "Merchandise item deleted"}, 200

class AdminProjectStats(Resource):
    @admin_required()
    def get(self):
        total_projects = Project.query.count()
        approved_projects = Project.query.filter_by(isApproved=True).count()
        pending_projects = Project.query.filter_by(isApproved=False).count()

        
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
            "average_review_rating": average_rating,
            "top_projects_by_reviews": [{"title": p.title, "review_count": p.review_count} for p in top_projects_by_reviews]
        }, 200



class MerchandiseCatalog(Resource):
    def get(self):
        merchandise_items = Merchandise.get_all()
        return [item.serialize() for item in merchandise_items], 200


class UserCart(Resource):
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

        return {"msg": "Item removed from cart", "cart": cart.serialize()}, 200

class UserOrders(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=current_user_id).filter(Order.payment_status != 'Pending').all()
        return [order.serialize() for order in orders], 200

    @jwt_required()
    def post(self):
        current_user_id = get_jwt_identity()
        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()

        if not cart or not cart.items:
            return {"msg": "No items in cart to checkout"}, 400

        cart.update(payment_status='Completed')

        return {"msg": "Order placed successfully", "order": cart.serialize()}, 200

class ProjectPurchase(Resource):
    @jwt_required()
    def post(self, project_id):
        current_user_id = get_jwt_identity()
        project = Project.get_by_id(project_id)

        if not project:
            return {"msg": "Project not found"}, 404
        if not project.isForSale:
            return {"msg": "This project is not marked for sale"}, 400
        if project.price <= 0:
            return {"msg": "Project has no valid price for purchase"}, 400

        cart = Order.query.filter_by(user_id=current_user_id, payment_status='Pending').first()
        if not cart:
            cart = Order.create(user_id=current_user_id, total_amount=0.0, payment_status='Pending')

        project_item_id = -project.id

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
        project = Project.get_by_id(project_id)
        if not project:
            return {"msg": "Project not found"}, 404
        
        all_reviews = []
        
        for review in project.reviews_through_users_projects:
            all_reviews.append(review.serialize())
        
        return all_reviews, 200

    
    @jwt_required()
    def post(self, project_id):
        current_user_id = get_jwt_identity()
        data = request.get_json()
        rating = data.get('rating')
        comment = data.get('comment')
        
        
        users_project_id = data.get('users_project_id') 

        if not all([rating is not None, 1 <= rating <= 5, users_project_id]):
            return {"msg": "Rating (1-5) and users_project_id are required"}, 400

        users_project_entry = UsersProject.get_by_id(users_project_id)
        if not users_project_entry or users_project_entry.project_id != project_id:
            return {"msg": "Invalid users_project_id for this project"}, 404
        
        existing_review = Review.query.filter_by(
            user_project_id=users_project_id,
            reviewer_id=current_user_id
        ).first()

        if existing_review:
            return {"msg": "You have already submitted a review for this specific project involvement."}, 409

        try:
            new_review = Review.create(
                user_project_id=users_project_id,
                rating=rating,
                comment=comment,
                reviewer_id=current_user_id 
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
        current_user_id = get_jwt_identity()
        review = Review.get_by_id(review_id)

        if not review:
            return {"msg": "Review not found"}, 404
        
        
        if review.users_project.project_id != project_id:
            return {"msg": "Review does not belong to this project"}, 400

        
        if review.reviewer_id != current_user_id:
            return {"msg": "You don't have permission to update this review"}, 403

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
        current_user_id = get_jwt_identity()
        review = Review.get_by_id(review_id)

        if not review:
            return {"msg": "Review not found"}, 404

        if review.users_project.project_id != project_id:
            return {"msg": "Review does not belong to this project"}, 400

        if review.reviewer_id != current_user_id:
            return {"msg": "You don't have permission to delete this review"}, 403

        try:
            review.delete()
            return {"msg": "Review deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error deleting review: {e}")
            return {"msg": "An unexpected error occurred while deleting review."}, 500


class AdminUsers(Resource):
    @admin_required()
    def get(self):
        """Get all user records (including students, admins, general users)."""
        try:
            users = User.get_all()
            return [user.serialize() for user in users], 200
        except Exception as e:
            db.session.rollback()
            print(f"Error fetching all users: {e}")
            return {"msg": "An unexpected error occurred while fetching user list."}, 500

    @admin_required()
    def patch(self, user_id):
        """Update a specific user's details by ID."""
        try:
            user = User.get_by_id(user_id)
            if not user:
                return {"msg": "User not found"}, 404

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
        except IntegrityError as e:
            db.session.rollback()
            print(f"Database Integrity Error updating user {user_id}: {e}")
            if "UNIQUE constraint failed" in str(e):
                return {"msg": "Email or username already registered to another user."}, 409
            return {"msg": "Database error updating user. Please try again."}, 400
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error updating user {user_id}: {e}")
            return {"msg": "An unexpected error occurred while updating user."}, 500

    @admin_required()
    def delete(self, user_id):
        """Delete a specific user record by ID."""
        try:
            user = User.get_by_id(user_id)
            if not user:
                return {"msg": "User not found"}, 404

            user.delete()
            return {"msg": "User deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error deleting user {user_id}: {e}")
            return {"msg": "An unexpected error occurred while deleting user."}, 500



api.add_resource(AuthRegister, '/register') # done
api.add_resource(AuthLogin, '/login') # done
api.add_resource(UserProfile, '/me') # done
api.add_resource(UserProject, '/me/projects') # done
api.add_resource(ProjectUpload, '/projects/upload') # done
api.add_resource(PublicProjects, '/projects') # done
api.add_resource(SingleProject, '/projects/<int:project_id>') # done


api.add_resource(AdminProjectManagement, '/admin/projects', '/admin/projects/<int:project_id>') # done
api.add_resource(AdminMerchandiseManagement, '/admin/merchandise', '/admin/merchandise/<int:merchandise_id>') # done
api.add_resource(AdminProjectStats, '/admin/stats/projects') # done
api.add_resource(AdminUsers, '/admin/users', '/admin/users/<int:user_id>') # done


api.add_resource(MerchandiseCatalog, '/merchandise') # done
api.add_resource(UserCart, '/cart', '/cart/<int:item_id>') # done 
api.add_resource(UserOrders, '/orders') # done


api.add_resource(ProjectPurchase, '/projects/<int:project_id>/purchase') # done
api.add_resource(ProjectReviews, '/projects/<int:project_id>/reviews', '/projects/<int:project_id>/reviews/<int:review_id>')


app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
