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

    serialize_rules = (
        '-_password_hash',
        'role.name',
    )

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
            'role': self.role.name if self.role else None
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
            **kwargs
        )
        user.set_password(password)
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
    # --- MODIFICATION START ---
    # Use db.JSON for JSON column, no length needed
    collaborators = db.Column(db.JSON, nullable=False) 
    # --- MODIFICATION END ---
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tech_stack = db.Column(db.String(255))
    github_link = db.Column(db.String(255), nullable=False)
    live_preview_url = db.Column(db.String(255))
    image_url = db.Column(db.String(255))
    isForSale = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=0.0)
    uploaded_by = db.Column(db.String(80), db.ForeignKey('users.username'), nullable=False)
    isApproved = db.Column(db.Boolean, default=False)
    status_changed_by = db.Column(db.String(80)) 
    review_reason = db.Column(db.Text, nullable=True)
    file = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', foreign_keys=[uploaded_by], backref='uploaded_projects')

    serialize_rules = (
        '-users_projects.project',
        '-reviews.user_project',
    )

    def serialize(self):
        serialized_collaborators = []
        # Ensure self.collaborators is iterable and contains dictionaries
        if isinstance(self.collaborators, list):
            for collab in self.collaborators:
                if isinstance(collab, dict) and 'name' in collab and 'email' in collab:
                    serialized_collaborators.append({
                        'name': collab['name'],
                        'email': collab['email']
                    })
        elif isinstance(self.collaborators, dict) and 'name' in self.collaborators and 'email' in self.collaborators:
            # Fallback for a single dictionary if that somehow gets stored
            serialized_collaborators.append({
                'name': self.collaborators['name'],
                'email': self.collaborators['email']
            })
        
        return {
            'id': self.id,
            'title': self.title,
            'collaborators': serialized_collaborators, # Now correctly serializing the list
            'category': self.category,
            'description': self.description,
            'tech_stack': self.tech_stack,
            'github_link': self.github_link,
            'live_preview_url': self.live_preview_url,
            'image_url': self.image_url,
            'isForSale': self.isForSale,
            'price': self.price,
            'uploaded_by': self.uploaded_by,
            'isApproved': self.isApproved,
            'status_changed_by': self.status_changed_by,
            'review_reason': self.review_reason,
            'file': self.file,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
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

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def search_and_filter(cls, query=None, category=None, tech_stack=None, uploaded_by=None, isApproved=None):
        q = cls.query
        if query:
            q = q.filter(
                (cls.title.ilike(f'%{query}%')) |
                (cls.description.ilike(f'%{query}%'))
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


class UsersProject(db.Model, SerializerMixin):
    __tablename__ = 'users_projects'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False) # e.g., 'uploading', 'collaborating'
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('user_projects', cascade='all, delete-orphan'))
    project = db.relationship('Project', backref=db.backref('users_projects', cascade='all, delete-orphan'))

    serialize_rules = (
        '-user.user_projects', # Prevent recursive serialization
        '-project.users_projects', # Prevent recursive serialization
    )

    @classmethod
    def create(cls, **kwargs):
        record = cls(**kwargs)
        db.session.add(record)
        db.session.commit()
        return record


# class Review(db.Model, SerializerMixin):
#     __tablename__ = 'reviews'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
#     rating = db.Column(db.Integer, nullable=False) # e.g., 1-5
#     comment = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
#     updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

#     user = db.relationship('User', backref=db.backref('reviews', lazy=True))
#     project = db.relationship('Project', backref=db.backref('reviews', lazy=True))

#     serialize_rules = (
#         '-user.reviews',
#         '-project.reviews',
#     )

#########################################################################################
class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False) # e.g., 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Add a relationship to the User model
    # 'User' should be the actual class name of your User model
    user = db.relationship('User', backref='reviews_by_user')

    def serialize(self):
        return {
            'id': self.id,
            'rating': self.rating,
            'comment': self.comment,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'reviewerName': self.user.username if self.user else None # <--- IMPORTANT: Get username from the related User object
        }

    @classmethod
    def create(cls, **kwargs):
        review = cls(**kwargs)
        db.session.add(review)
        db.session.commit()
        return review

#########################################################################################



class Merchandise(db.Model, SerializerMixin):
    __tablename__ = 'merchandise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer, default=0)
    category = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "stock_quantity": self.stock_quantity,
            "category": self.category,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @classmethod
    def create(cls, **kwargs):
        merchandise = cls(**kwargs)
        db.session.add(merchandise)
        db.session.commit()
        return merchandise

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_id(cls, merchandise_id):
        return cls.query.get(merchandise_id)

    @classmethod
    def get_all(cls):
        return cls.query.all()


class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    payment_status = db.Column(db.String(50), default='Pending') # e.g., Pending, Completed, Failed
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    order_items = db.relationship('OrderItem', backref='order', lazy=True, cascade='all, delete-orphan')

    serialize_rules = (
        '-user.orders',
        'order_items.merchandise.name',
        'order_items.merchandise.description',
        'order_items.merchandise.price',
        'order_items.merchandise.image_url',
    )

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "order_items": [item.serialize() for item in self.order_items]
        }

    @classmethod
    def create(cls, **kwargs):
        order = cls(**kwargs)
        db.session.add(order)
        db.session.commit()
        return order

    @classmethod
    def get_by_id(cls, order_id):
        return cls.query.get(order_id)


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
            'merchandise_name': self.merchandise.name if self.merchandise else None,
            'merchandise_image_url': self.merchandise.image_url if self.merchandise else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    @classmethod
    def create(cls, **kwargs):
        order_item = cls(**kwargs)
        db.session.add(order_item)
        db.session.commit()
        return order_item

    @classmethod
    def get_by_id(cls, item_id):
        return cls.query.get(item_id)

    def update(self, **kwargs):
        if 'quantity' in kwargs and self.price_at_purchase is not None:
            self.quantity = kwargs['quantity']
            self.subtotal = self.quantity * self.price_at_purchase
        elif 'quantity' in kwargs:
            self.quantity = kwargs['quantity']
        
        for key, value in kwargs.items():
            if key not in ['quantity', 'subtotal'] and hasattr(self, key):
                setattr(self, key, value)
        
        if self.order:
            self.order.total_amount = sum(item.subtotal for item in self.order.order_items)
            db.session.add(self.order)
        
        db.session.commit()

    def delete(self):
        if self.order:
            self.order.total_amount -= self.subtotal
            db.session.add(self.order)
        
        db.session.delete(self)
        db.session.commit()


class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    
    # M-Pesa specific fields
    mpesa_checkout_request_id = db.Column(db.String(255), unique=True, nullable=True)
    merchant_request_id = db.Column(db.String(255), unique=True, nullable=True)
    mpesa_receipt_number = db.Column(db.String(255), unique=True, nullable=True) # Will be populated on successful callback
    transaction_date = db.Column(db.String(255), nullable=True) # Date from M-Pesa callback
    amount_paid_callback = db.Column(db.Float, nullable=True) # Actual amount from callback, for reconciliation
    phone_number_callback = db.Column(db.String(20), nullable=True) # Phone number from callback

    status = db.Column(db.String(50), default='PENDING', nullable=False) # e.g., PENDING, PENDING_MPESA_STK, COMPLETED, FAILED, FAILED_INITIATION
    result_code = db.Column(db.Integer, nullable=True) # M-Pesa ResultCode
    result_desc = db.Column(db.String(500), nullable=True) # M-Pesa ResultDesc

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    order = db.relationship('Order', backref=db.backref('payments', lazy=True))
    user = db.relationship('User', backref=db.backref('payments', lazy=True))

    serialize_rules = (
        '-order.payments', '-user.payments', # Prevent circular serialization
        'created_at', 'updated_at'
    )

    def __repr__(self):
        return f"<Payment {self.id} - Order {self.order_id} - Status: {self.status}>"

    @classmethod
    def get_by_id(cls, payment_id):
        return cls.query.get(payment_id)

    @classmethod
    def create(cls, **kwargs):
        new_payment = cls(**kwargs)
        db.session.add(new_payment)
        db.session.commit()
        db.session.refresh(new_payment)
        return new_payment

    def update(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()
        db.session.refresh(self)
        return self

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class PaymentLog(db.Model):
    __tablename__ = 'payment_logs'

    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default="initiated")
    receipt_number = db.Column(db.String(100), nullable=True)
    merchant_request_id = db.Column(db.String(100), nullable=True)
    checkout_request_id = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
