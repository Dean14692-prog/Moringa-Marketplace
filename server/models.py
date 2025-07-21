# server/models.py
from  flask import flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData, func
from sqlalchemy.schema import UniqueConstraint
from werkzeug.security import generate_password_hash, check_password_hash
import re 

metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})
db = SQLAlchemy(metadata=metadata)
class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    users = db.relationship('User', back_populates='role_obj', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def save(self):
        """Adds or updates the role in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name): 
        """Creates and saves a new role."""
        if cls.get_by_name(name):
            raise ValueError(f"Role '{name}' already exists.")
        role = cls(name=name)
        role.save()
        return role

    @classmethod
    def get_by_id(cls, role_id):
        """Retrieves a role by ID."""
        return cls.query.get(role_id)

    @classmethod
    def get_by_name(cls, name):
        """Retrieves a role by name."""
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        """Retrieves all roles."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates role attributes and saves changes."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the role from the database."""
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Role {self.name}>"

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False, default=1) 
    profile_pic_url = db.Column(db.String(255), default='https://via.placeholder.com/150')
    github_link = db.Column(db.String(255))
    linkedin_link = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    # Relationships with back_populates
    reviews = db.relationship('Review', back_populates='reviewer', lazy=True, cascade="all, delete-orphan")
    orders = db.relationship('Order', back_populates='user', lazy=True, cascade="all, delete-orphan")
    created_projects = db.relationship('Project', back_populates='creator', lazy=True, cascade="all, delete-orphan")
    user_projects = db.relationship('UserProject', back_populates='user', lazy=True, cascade="all, delete-orphan")

    role_obj = db.relationship('Role', back_populates='users')
  
    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks if the provided password matches the hashed password."""
        return check_password_hash(self.password_hash, password)

    def validate_email(self, email):
        """Basic email format validation."""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(email_regex, email) is not None

    def serialize(self):
        """Serializes user data for API responses."""
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role_obj.name if self.role_obj else None,
            "profile_pic_url": self.profile_pic_url,
            "github_link": self.github_link,
            "linkedin_link": self.linkedin_link,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        """Adds or updates the user in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, username, first_name, last_name, email, password, role_name="user", profile_pic_url=None, github_link=None, linkedin_link=None): # MODIFIED: Accepts role_name
        """Creates and saves a new user."""
        if not cls().validate_email(email):
            raise ValueError("Invalid email format.")
        if cls.get_by_email(email):
            raise ValueError("Email already exists.")
        if cls.get_by_username(username):
            raise ValueError("Username already exists.")

        role = Role.get_by_name(role_name)
        if not role:
            raise ValueError(f"Role '{role_name}' not found. Please create this role first.")
        role_id = role.id
    
        user = cls(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role_id=role_id, 
            profile_pic_url=profile_pic_url,
            github_link=github_link,
            linkedin_link=linkedin_link
        )
        user.set_password(password)
        user.save()
        return user

    @classmethod
    def get_by_id(cls, user_id):
        """Retrieves a user by ID."""
        return cls.query.get(user_id)

    @classmethod
    def get_by_email(cls, email):
        """Retrieves a user by email."""
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_username(cls, username):
        """Retrieves a user by username."""
        return cls.query.filter_by(username=username).first()

    @classmethod
    def get_all(cls):
        """Retrieves all users."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates user attributes and saves changes."""
        for key, value in kwargs.items():
            if key == 'password':
                self.set_password(value)
            elif key == 'role_name':
                role = Role.get_by_name(value)
                if not role:
                    raise ValueError(f"Role '{value}' not found.")
                setattr(self, 'role_id', role.id)
            elif hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the user from the database."""
        db.session.delete(self)
        db.session.commit()

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github_link = db.Column(db.String(255), nullable=False)
    demo_link = db.Column(db.String(255))
    for_sale = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=0)
    file_url = db.Column(db.String(255))
    status = db.Column(db.String(50), default="Pending")

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    reviews = db.relationship('Review', back_populates='project', lazy=True, cascade="all, delete-orphan")
    creator = db.relationship('User', back_populates='created_projects', lazy=True)
    project_users = db.relationship('UserProject', back_populates='project', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        """String representation of the Project object."""
        creator_name = self.creator.username if self.creator else "Unknown"
        return f"<Project {self.title} by {creator_name}>"

    def serialize(self):
        """Serializes project data for API responses."""
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "github_link": self.github_link,
            "demo_link": self.demo_link,
            "for_sale": self.for_sale,
            "price": self.price,
            "file_url": self.file_url,
            "status": self.status,
            "student_id": self.student_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "contributors": [up.user.serialize() for up in self.project_users]
        }

    def save(self):
        """Adds or updates the project in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, title, category, description, github_link, student_id, demo_link=None, for_sale=False, price=0.0, file_url=None, status="Pending"):
        """Creates and saves a new project."""
        project = cls(
            title=title,
            category=category,
            description=description,
            github_link=github_link,
            demo_link=demo_link,
            for_sale=for_sale,
            price=price,
            file_url=file_url,
            student_id=student_id,
            status=status
        )
        project.save()
        return project

    @classmethod
    def get_by_id(cls, project_id):
        """Retrieves a project by ID."""
        return cls.query.get(project_id)

    @classmethod
    def get_by_title(cls, title):
        """Retrieves a project by title."""
        return cls.query.filter_by(title=title).first()

    @classmethod
    def get_all(cls):
        """Retrieves all projects."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates project attributes and saves changes."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the project from the database."""
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def search_and_filter(cls, query=None, category=None, status="Approved", min_price=None, max_price=None):
        """Searches and filters projects."""
        q = cls.query.filter_by(status=status) 
        
        if query:
            q = q.filter(
                (cls.title.ilike(f'%{query}%')) |
                (cls.description.ilike(f'%{query}%'))
            )
        if category:
            q = q.filter_by(category=category)
        if min_price is not None:
            q = q.filter(cls.price >= min_price)
        if max_price is not None:
            q = q.filter(cls.price <= max_price)
            
        return q.all()

    def add_contributor(self, user_id):
        """Adds a user as a contributor to this project."""
        existing_contributor = UserProject.query.filter_by(project_id=self.id, user_id=user_id).first()
        if existing_contributor:
            print(f"User {user_id} is already a contributor to project {self.id}.")
            return existing_contributor
        
        contributor = UserProject.create(user_id=user_id, project_id=self.id)
        return contributor

    def remove_contributor(self, user_id):
        """Removes a user as a contributor from this project."""
        contributor = UserProject.query.filter_by(project_id=self.id, user_id=user_id).first()
        if contributor:
            contributor.delete()
            return True
        return False
    
class UserProject(db.Model):
    __tablename__ = 'user_projects'
    __table_args__ = (UniqueConstraint('user_id', 'project_id', name='_user_project_uc'),)

    id = db.Column(db.Integer, primary_key=True) 
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = db.relationship('User', back_populates='user_projects')
    project = db.relationship('Project', back_populates='project_users')

    def serialize(self):
        """Serializes UserProject data."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "user_username": self.user.username if self.user else None,
            "project_title": self.project.title if self.project else None, 
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def save(self):
        """Adds or updates the UserProject entry in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, user_id, project_id):
        """Creates and saves a new UserProject entry."""
        user_project = cls(user_id=user_id, project_id=project_id)
        user_project.save()
        return user_project

    @classmethod
    def get_by_ids(cls, user_id, project_id):
        """Retrieves a UserProject entry by user and project ID."""
        return cls.query.filter_by(user_id=user_id, project_id=project_id).first()

    def delete(self):
        """Deletes the UserProject entry from the database."""
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<UserProject UserID:{self.user_id} ProjectID:{self.project_id}>"

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False) 
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    reviewer = db.relationship('User', back_populates='reviews')
    project = db.relationship('Project', back_populates='reviews')

    def serialize(self):
        """Serializes review data for API responses."""
        return {
            "id": self.id,
            "project_id": self.project_id,
            "reviewer_id": self.reviewer_id,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        """Adds or updates the review in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, project_id, reviewer_id, rating, comment=None):
        """Creates and saves a new review."""
        if not 1 <= rating <= 5:
            raise ValueError("Rating must be between 1 and 5.")
        review = cls(project_id=project_id, reviewer_id=reviewer_id, rating=rating, comment=comment)
        review.save()
        return review

    @classmethod
    def get_by_id(cls, review_id):
        """Retrieves a review by ID."""
        return cls.query.get(review_id)

    @classmethod
    def get_by_project_id(cls, project_id):
        """Retrieves all reviews for a specific project."""
        return cls.query.filter_by(project_id=project_id).all()

    @classmethod
    def get_by_reviewer_id(cls, reviewer_id):
        """Retrieves all reviews made by a specific user."""
        return cls.query.filter_by(reviewer_id=reviewer_id).all()

    @classmethod
    def get_all(cls):
        """Retrieves all reviews."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates review attributes and saves changes."""
        if 'rating' in kwargs and not (1 <= kwargs['rating'] <= 5):
            raise ValueError("Rating must be between 1 and 5.")
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the review from the database."""
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Review ID:{self.id} Project:{self.project_id} By:{self.reviewer_id} Rating:{self.rating}>"

class Merchandise(db.Model):
    __tablename__ = 'merchandise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(100), nullable=True) 
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    order_items = db.relationship('OrderItem', back_populates='merchandise_item', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        """Serializes merchandise data for API responses."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "category": self.category,
            "stock_quantity": self.stock_quantity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Merchandise {self.name} (Price: ${self.price:.2f}, Stock: {self.stock_quantity})>"

    def save(self):
        """Adds or updates the merchandise item in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name, price, description=None, image_url=None, category=None, stock_quantity=0):
        """Creates and saves a new merchandise item."""
        if price < 0:
            raise ValueError("Price cannot be negative.")
        if stock_quantity < 0:
            raise ValueError("Stock quantity cannot be negative.")
        merchandise = cls(
            name=name,
            description=description,
            price=price,
            image_url=image_url,
            category=category,
            stock_quantity=stock_quantity
        )
        merchandise.save()
        return merchandise

    @classmethod
    def get_by_id(cls, merchandise_id):
        """Retrieves a merchandise item by ID."""
        return cls.query.get(merchandise_id)

    @classmethod
    def get_by_name(cls, name):
        """Retrieves a merchandise item by name."""
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        """Retrieves all merchandise items."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates merchandise attributes and saves changes."""
        if 'price' in kwargs and kwargs['price'] < 0:
            raise ValueError("Price cannot be negative.")
        if 'stock_quantity' in kwargs and kwargs['stock_quantity'] < 0:
            raise ValueError("Stock quantity cannot be negative.")
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the merchandise item from the database."""
        db.session.delete(self)
        db.session.commit()


class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False, default=0.0) 
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = db.relationship('User', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        """Serializes order data for API responses."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "items": [item.serialize() for item in self.items]
        }

    def __repr__(self):
        return f"<Order {self.id} for User {self.user_id} (Total: ${self.total_amount:.2f}, Status: {self.status})>"

    def save(self):
        """Adds or updates the order in the database."""
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, user_id, status='pending'):
        """Creates and saves a new order. Total amount is calculated by adding items."""
        order = cls(user_id=user_id, total_amount=0.0, status=status)
        order.save() 
        return order

    @classmethod
    def get_by_id(cls, order_id):
        """Retrieves an order by ID."""
        return cls.query.get(order_id)

    @classmethod
    def get_by_user_id(cls, user_id):
        """Retrieves all orders for a specific user."""
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def get_all(cls):
        """Retrieves all orders."""
        return cls.query.all()

    def update(self, **kwargs):
        """Updates order attributes and saves changes."""
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        """Deletes the order from the database."""
        db.session.delete(self)
        db.session.commit()

    def add_item(self, merchandise_id, quantity):
        """Adds an item to the order and updates total_amount."""
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            raise ValueError(f"Merchandise with ID {merchandise_id} not found.")
        if quantity <= 0:
            raise ValueError("Quantity must be positive.")
        if merchandise.stock_quantity < quantity:
            raise ValueError(f"Not enough stock for {merchandise.name}. Available: {merchandise.stock_quantity}")

        existing_item = next((item for item in self.items if item.merchandise_id == merchandise_id), None)
        if existing_item:
            existing_item.update(quantity=existing_item.quantity + quantity)
        else:
            item = OrderItem.create(
                order_id=self.id,
                merchandise_id=merchandise_id,
                quantity=quantity,
                unit_price=merchandise.price
            )
            self.total_amount += (quantity * merchandise.price)
            merchandise.stock_quantity -= quantity
            merchandise.save() 
            self.save() 
        
        return item if not existing_item else existing_item

    def remove_item(self, item_id):
        """Removes an item from the order and updates total_amount and merchandise stock."""
        item = OrderItem.get_by_id(item_id)
        if item and item.order_id == self.id:
            item.delete() 
            return True
        else:
            raise ValueError("Item not found in this order or does not belong to it.")
    def clear_items(self):
        """Removes all items from the order, resets total_amount, and updates merchandise stock."""
    
        for item in list(self.items): 
            self.remove_item(item.id)
        self.total_amount = 0.0
        self.save()
        return True

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    
    __table_args__ = (UniqueConstraint('order_id', 'merchandise_id', name='_order_merchandise_uc'),)

    order = db.relationship('Order', back_populates='items')
    merchandise_item = db.relationship('Merchandise', back_populates='order_items')

    def serialize(self):
        """Serializes order item data for API responses."""
        return {
            "id": self.id,
            "order_id": self.order_id,
            "merchandise_id": self.merchandise_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.get_total_price()
        }

    def get_total_price(self):
        """Calculates the total price for this order item."""
        return self.quantity * self.unit_price

    def __repr__(self):
        return f"<OrderItem {self.id} (Order: {self.order_id}, Merchandise: {self.merchandise_id}, Qty: {self.quantity})>"

    def save(self):
        """Adds or updates the order item in the database, also updating parent order total and merchandise stock."""
        original_quantity = 0
        
        if self.id and db.session.is_modified(self, include_collections=False):
            old_item = db.session.query(OrderItem).get(self.id)
            if old_item:
                original_quantity = old_item.quantity
                
        db.session.add(self)
        db.session.flush() 

        if self.order:
            self.order.total_amount = sum(item.get_total_price() for item in self.order.items)
            db.session.add(self.order)

        if self.merchandise_item and 'quantity' in db.inspect(self).attrs.keys(): 
            stock_change = original_quantity - self.quantity 
            self.merchandise_item.stock_quantity += stock_change
            db.session.add(self.merchandise_item)
            
        db.session.commit()

    @classmethod
    def create(cls, order_id, merchandise_id, quantity, unit_price):
        """Creates and saves a new order item."""
        if quantity <= 0:
            raise ValueError("Quantity must be positive.")
        if unit_price < 0:
            raise ValueError("Unit price cannot be negative.")
        
        merchandise = Merchandise.get_by_id(merchandise_id)
        if not merchandise:
            raise ValueError(f"Merchandise with ID {merchandise_id} not found.")
        if merchandise.stock_quantity < quantity:
            raise ValueError(f"Not enough stock for {merchandise.name}. Available: {merchandise.stock_quantity}")
            
        order_item = cls(order_id=order_id, merchandise_id=merchandise_id, quantity=quantity, unit_price=unit_price)
        db.session.add(order_item)
        db.session.flush()
        order = Order.get_by_id(order_id)
        if order:
            order.total_amount += order_item.get_total_price()
            db.session.add(order)

        merchandise.stock_quantity -= quantity
        db.session.add(merchandise)
        
        db.session.commit()
        return order_item

    @classmethod
    def get_by_id(cls, item_id):
        """Retrieves an order item by ID."""
        return cls.query.get(item_id)

    @classmethod
    def get_by_order_id(cls, order_id):
        """Retrieves all order items for a specific order."""
        return cls.query.filter_by(order_id=order_id).all()

    @classmethod
    def get_by_merchandise_id(cls, merchandise_id):
        """Retrieves all order items for a specific merchandise."""
        return cls.query.filter_by(merchandise_id=merchandise_id).all()

    def update(self, **kwargs):
        """Updates order item attributes and saves changes."""
        old_quantity = self.quantity 

        if 'quantity' in kwargs:
            new_quantity = kwargs['quantity']
            if new_quantity <= 0:
                raise ValueError("Quantity must be positive.")
            if new_quantity > old_quantity and self.merchandise_item.stock_quantity < (new_quantity - old_quantity):
                raise ValueError(f"Not enough stock for {self.merchandise_item.name}. Available: {self.merchandise_item.stock_quantity}")
            
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        
        db.session.add(self)
        db.session.flush() 
        if 'quantity' in kwargs and self.merchandise_item:
            stock_change = old_quantity - self.quantity 
            self.merchandise_item.stock_quantity += stock_change
            db.session.add(self.merchandise_item)

        if self.order:
            self.order.total_amount = sum(item.get_total_price() for item in self.order.items)
            db.session.add(self.order)
            
        db.session.commit()


    def delete(self):
        """Deletes the order item from the database, updating parent order total and merchandise stock."""
        if self.merchandise_item:
            self.merchandise_item.stock_quantity += self.quantity
            db.session.add(self.merchandise_item)

        if self.order:
            self.order.total_amount -= self.get_total_price()
            db.session.add(self.order)

        db.session.delete(self)
        db.session.commit()