# models.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class Role(db.Model, SerializerMixin):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self):
        return f'<Role {self.name}>'

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def create(cls, **kwargs):
        role = cls(**kwargs)
        db.session.add(role)
        db.session.commit()
        return role

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    bio = db.Column(db.Text)
    profile_pic = db.Column(db.String(255))
    github = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    skills = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    role = db.relationship('Role', backref=db.backref('users', lazy=True))

    # Add this to ensure 'role' is included in serialization for direct access
    # If you have a custom serialize method, ensure it returns 'role'
    serialize_rules = (
        '-_password_hash', # Exclude password hash from serialization
        'role.name',       # Include the name of the associated role
    )

    # Custom serialize method to ensure role is always included and explicitly named 'role'
    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'bio': self.bio,
            'profile_pic': self.profile_pic,
            'github': self.github,
            'linkedin': self.linkedin,
            'skills': self.skills,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'role': self.role.name if self.role else None # This line is critical for frontend
        }

    def set_password(self, password):
        self._password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self._password_hash, password)

    @classmethod
    def create(cls, username, first_name, last_name, email, password, role_id, **kwargs):
        user = cls(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role_id=role_id,
            **kwargs # For bio, profile_pic, github, linkedin, skills
        )
        user.set_password(password) # Hash the password before saving
        db.session.add(user)
        db.session.commit()
        return user

    @classmethod
    def get_by_id(cls, user_id):
        return cls.query.get(user_id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tech_stack = db.Column(db.String(255))
    github_link = db.Column(db.String(255), nullable=False)
    live_preview_url = db.Column(db.String(255))
    isForSale = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=0.0)
    uploaded_by = db.Column(db.String(80), db.ForeignKey('users.username'), nullable=False) # Store username
    isApproved = db.Column(db.Boolean, default=False)
    status_changed_by = db.Column(db.String(80)) 
    review_reason = db.Column(db.Text, nullable=True) # ADDED THIS LINE
    file = db.Column(db.String(255)) # Path to uploaded file/image
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', foreign_keys=[uploaded_by], backref='uploaded_projects')

    serialize_rules = (
        '-users_projects.project', # Prevent recursive serialization
        '-reviews.user_project',   # Prevent recursive serialization
    )

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'tech_stack': self.tech_stack,
            'github_link': self.github_link,
            'live_preview_url': self.live_preview_url,
            'isForSale': self.isForSale,
            'price': self.price,
            'uploaded_by': self.uploaded_by,
            'isApproved': self.isApproved,
            'status_changed_by': self.status_changed_by,
            'review_reason': self.review_reason, # ADDED THIS LINE
            'file': self.file,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            # You can add user details if needed, e.g., 'uploader_details': self.user.serialize()
        }

    @classmethod
    def create(cls, **kwargs):
        project = cls(**kwargs)
        db.session.add(project)
        db.session.commit()
        return project

    @classmethod
    def get_by_id(cls, project_id):
        return cls.query.get(project_id)

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def search_and_filter(cls, query=None, category=None, tech_stack=None, uploaded_by=None, isApproved=None):
        q = cls.query
        if query:
            q = q.filter(
                (cls.title.ilike(f'%{query}%')) |
                (cls.description.ilike(f'%{query}%')) |
                (cls.tech_stack.ilike(f'%{query}%'))
            )
        if category:
            q = q.filter_by(category=category)
        if tech_stack:
            q = q.filter(cls.tech_stack.ilike(f'%{tech_stack}%'))
        if uploaded_by:
            q = q.filter_by(uploaded_by=uploaded_by)
        if isApproved is not None:
            q = q.filter_by(isApproved=isApproved)
        return q.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class UsersProject(db.Model, SerializerMixin):
    __tablename__ = 'users_projects'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    action = db.Column(db.String(50)) # e.g., 'uploading', 'collaborating', 'reviewing', 'approving', 'rejecting'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('user_actions', lazy=True))
    project = db.relationship('Project', backref=db.backref('project_users_actions', lazy=True))

    serialize_rules = (
        '-user.user_actions',
        '-project.project_users_actions',
    )

    @classmethod
    def create(cls, **kwargs):
        user_project = cls(**kwargs)
        db.session.add(user_project)
        db.session.commit()
        return user_project

    @classmethod
    def get_by_user_and_project(cls, user_id, project_id, action):
        return cls.query.filter_by(user_id=user_id, project_id=project_id, action=action).first()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_project_id = db.Column(db.Integer, db.ForeignKey('users_projects.id'), nullable=False) # Link to a specific user's action on a project
    rating = db.Column(db.Integer, nullable=False) # e.g., 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user_project = db.relationship('UsersProject', backref=db.backref('reviews', lazy=True))

    serialize_rules = (
        '-user_project.reviews',
    )

    @classmethod
    def create(cls, **kwargs):
        review = cls(**kwargs)
        db.session.add(review)
        db.session.commit()
        return review

class Merchandise(db.Model, SerializerMixin):
    __tablename__ = 'merchandise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    serialize_rules = (
        # No recursive rules needed for Merchandise itself, unless linked to others
    )

    @classmethod
    def create(cls, **kwargs):
        merchandise = cls(**kwargs)
        db.session.add(merchandise)
        db.session.commit()
        return merchandise

    @classmethod
    def get_by_id(cls, merch_id):
        return cls.query.get(merch_id)

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='Pending') # e.g., 'Pending', 'Completed', 'Failed'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade="all, delete-orphan")

    serialize_rules = (
        '-user.orders',
        'order_items.merchandise', # Include merchandise details for each order item
    )

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'order_items': [item.serialize() for item in self.order_items]
        }

    @classmethod
    def create(cls, **kwargs):
        order = cls(**kwargs)
        db.session.add(order)
        db.session.commit()
        return order

    def add_item(self, merchandise_id, quantity, price_per_item):
        item = OrderItem.query.filter_by(order_id=self.id, merchandise_id=merchandise_id).first()
        if item:
            item.quantity += quantity
            item.subtotal = item.quantity * item.price_at_purchase
        else:
            item = OrderItem.create(order_id=self.id, merchandise_id=merchandise_id, quantity=quantity, price_at_purchase=price_per_item)
        
        # Update total amount for the order
        self.total_amount += (quantity * price_per_item) # Add the new item's value
        db.session.commit() # Commit changes to the order and the new/updated item
        return item

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price_at_purchase = db.Column(db.Float, nullable=False) # Price at the time of adding to cart
    subtotal = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    merchandise = db.relationship('Merchandise', backref=db.backref('order_items', lazy=True))

    serialize_rules = (
        '-order.order_items',
        'merchandise.name',
        'merchandise.description',
        'merchandise.price',
        'merchandise.image_url',
    )

    def serialize(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'merchandise_id': self.merchandise_id,
            'quantity': self.quantity,
            'price_at_purchase': self.price_at_purchase,
            'subtotal': self.subtotal,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'merchandise_name': self.merchandise.name if self.merchandise else None,
            'merchandise_image_url': self.merchandise.image_url if self.merchandise else None,
            'merchandise_price': self.merchandise.price if self.merchandise else None,
        }

    @classmethod
    def create(cls, order_id, merchandise_id, quantity, price_at_purchase):
        subtotal = quantity * price_at_purchase
        order_item = cls(
            order_id=order_id,
            merchandise_id=merchandise_id,
            quantity=quantity,
            price_at_purchase=price_at_purchase,
            subtotal=subtotal
        )
        db.session.add(order_item)
        db.session.commit()
        return order_item

    @classmethod
    def get_by_id(cls, item_id):
        return cls.query.get(item_id)

    def update(self, **kwargs):
        # Recalculate subtotal if quantity changes
        if 'quantity' in kwargs and self.price_at_purchase is not None:
            self.quantity = kwargs['quantity']
            self.subtotal = self.quantity * self.price_at_purchase
        elif 'quantity' in kwargs: # If price_at_purchase is None (shouldn't be, but as a safeguard)
            self.quantity = kwargs['quantity']
            # Subtotal calculation might be inaccurate without price, handle accordingly
        
        for key, value in kwargs.items():
            if key not in ['quantity', 'subtotal'] and hasattr(self, key): # Avoid double-setting quantity/subtotal
                setattr(self, key, value)
        
        # After updating the item, update the parent order's total_amount
        if self.order:
            self.order.total_amount = sum(item.subtotal for item in self.order.order_items)
            db.session.add(self.order) # Ensure the order is marked for update
        
        db.session.commit()

    def delete(self):
        # Before deleting, update the parent order's total_amount
        if self.order:
            self.order.total_amount -= self.subtotal
            db.session.add(self.order) # Mark for update
        
        db.session.delete(self)
        db.session.commit()