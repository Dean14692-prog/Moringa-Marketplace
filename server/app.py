from flask import Flask, jsonify, request, send_from_directory, Blueprint
from flask_restful import Api, Resource

from models import db, Student, Project, User, Merchandise, Review, Company, Order, OrderItem, ContactRequest, TeamProject
import os
import json # Added import for json
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


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_fallback_jwt_secret_key") # Added fallback for safety


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

class Student(Resource):
    @jwt_required()
    def get(self):
        students = Student

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
