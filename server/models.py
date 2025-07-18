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
    _password_hash = db.Column(db.String(128), nullable=True)
    is_google_auth = db.Column(db.Boolean, default=False, nullable=False)
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
            'role': self.role.name if self.role else None,
            'is_google_auth': self.is_google_auth
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


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False) # e.g., 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))
    project = db.relationship('Project', backref=db.backref('reviews', lazy=True))

    serialize_rules = (
        '-user.reviews',
        '-project.reviews',
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
        db.session.commit()from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData, func
from werkzeug.security import generate_password_hash, check_password_hash



metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
  __tablename__ = 'users'
  
  id = db.Column(db.Integer,primary_key=True)
  username = db.Column(db.String, nullable=False)
  first_name = db.Column(db.String, nullable=False)
  last_name = db.Column(db.String, nullable=False)
  email = db.Column(db.String, nullable=False, unique=True)
  password_hash = db.Column(db.String, nullable=False)
  role = db.Column(db.String, nullable=False)
  profile_pic_url = db.Column(db.String)
  created_at = db.Column(db.DateTime, default=datetime.utcnow)
  updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
  updated_at = db.Column(db.Datetime, onupdate=datetime.utcnow)
  
  
class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    github = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    role = db.Column(db.String(50), default="student")

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    projects = db.relationship("Project", backref="student", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "github": self.github,
            "linkedin": self.linkedin,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, name, email, password, github=None, linkedin=None):
        self.name = name
        self.email = email
        self.set_password(password)
        self.github = github
        self.linkedin = linkedin
        db.session.add(self)
        db.session.commit()
    
    def get_by_id(self, student_id):
        return Student.query.get(student_id)
    def get_by_email(self, email):
        return Student.query.filter_by(email=email).first()
    def get_all(self):
        return Student.query.all()
    def delete_by_id(self, student_id):
        student = Student.query.get(student_id)
        if student:
            db.session.delete(student)
            db.session.commit()
            return True
        return False
    def delete_by_email(self, email):
        student = Student.query.filter_by(email=email).first()
        if student:
            db.session.delete(student)
            db.session.commit()
            return True
        return False
    

  
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    github_link = db.Column(db.String(255), nullable=False)
    demo_link = db.Column(db.String(255))
    for_sale = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=0)
    file_url = db.Column(db.String(255))  # image/pdf upload
    status = db.Column(db.String(50), default="Pending")  # Approved, Rejected, etc.

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)

    student = db.relationship("Student", backref="projects")
    
    def __repr__(self):
        return f"<Project {self.title} by {self.student.name}>"
    
    def serialize(self):
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
    "created_at": self.created_at.isoformat() if self.created_at else None,
    "updated_at": self.updated_at.isoformat() if self.updated_at else None
}
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def create(self, title, category, description, github_link, demo_link=None, for_sale=False, price=0.0, file_url=None, student_id=None):
        self.title = title
        self.category = category
        self.description = description
        self.github_link = github_link
        self.demo_link = demo_link
        self.for_sale = for_sale
        self.price = price
        self.file_url = file_url
        self.student_id = student_id
        db.session.add(self)
        db.session.commit()
    
    def get_by_id(self, project_id):
        return Project.query.get(project_id)
    def get_by_title(self, title):
        return Project.query.filter_by(title=title).first()
    def get_all(self):
        return Project.query.all()
    def delete_by_id(self, project_id):
        project = Project.query.get(project_id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return True
        return False
    def delete_by_title(self, title):
        project = Project.query.filter_by(title=title).first()
        if project:
            db.session.delete(project)
            db.session.commit()
            return True
        return False
        
class TeamProject(db):
    __tablename__ = 'team_projects'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    role = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    responses = db.relationship('TeamResponse', backref='team_project')
    students = db.relationship('Student', backref='team_project')
    
    def serialize(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, project_id, role):
        self.project_id = project_id
        self.role = role
        db.session.add(self)
        db.session.commit()
    def update(self, project_id, role):
        self.project_id = project_id
        self.role = role
        db.session.commit()

    def get_by_id(self, team_project_id):
        return TeamProject.query.get(team_project_id)
    def get_by_project_id(self, project_id):
        return TeamProject.query.filter_by(project_id=project_id).first()
    def get_all(self):
        return TeamProject.query.all()
    def delete_by_id(self, team_project_id):
        team_project = TeamProject.query.get(team_project_id)
        if team_project:
            db.session.delete(team_project)
            db.session.commit()
            return True
        return False
    def delete_by_project_id(self, project_id):
        team_project = TeamProject.query.filter_by(project_id=project_id).first()
        if team_project:
            db.session.delete(team_project)
            db.session.commit()
            return True
        return False    
    

class TeamResponse(db.Model):
    __tablename__ = 'team_responses'
    id = db.Column(db.Integer, primary_key=True)
    team_project_id = db.Column(db.Integer, db.ForeignKey('team_projects.id'), nullable=False)
    response_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    team_project = db.relationship('TeamProject', backref='responses')
    
    def serialize(self):
        return {
            "id": self.id,
            "team_project_id": self.team_project_id,
            "response_text": self.response_text,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def create(self, team_project_id, response_text):
        self.team_project_id = team_project_id
        self.response_text = response_text
        db.session.add(self)
        db.session.commit()
    
    def update(self, response_text):
        self.response_text = response_text
        db.session.commit()
    def get_by_id(self, response_id):
        return TeamResponse.query.get(response_id)
    def get_by_team_project_id(self, team_project_id):
        return TeamResponse.query.filter_by(team_project_id=team_project_id).all()
    def get_all(self):
        return TeamResponse.query.all()
    def delete_by_id(self, response_id):
        response = TeamResponse.query.get(response_id)
        if response:
            db.session.delete(response)
            db.session.commit()
            return True
        return False    
    

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    project = db.relationship('Project', backref='reviews')
    reviewer = db.relationship('User', backref='reviews')
    def serialize(self):
            return {
                "id": self.id,
                "project_id": self.project_id,
                "reviewer_id": self.reviewer_id,
                "rating": self.rating,
                "comment": self.comment,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "updated_at": self.updated_at.isoformat() if self.updated_at else None
            }
    def create(self, project_id, reviewer_id, rating, comment=None):
            self.project_id = project_id
            self.reviewer_id = reviewer_id
            self.rating = rating
            self.comment = comment
            db.session.add(self)
            db.session.commit()
    def update(self, rating, comment=None):
            self.rating = rating
            self.comment = comment
            db.session.commit()
    def get_by_id(self, review_id):
            return Review.query.get(review_id)
    def get_by_project_id(self, project_id):
            return Review.query.filter_by(project_id=project_id).all()
    def get_by_reviewer_id(self, reviewer_id):
            return Review.query.filter_by(reviewer_id=reviewer_id).all()
    def get_all(self):
            return Review.query.all()
    def delete_by_id(self, review_id):
            review = Review.query.get(review_id)
            if review:
                db.session.delete(review)
                db.session.commit()
                return True
            return False    
    

class Merchandise(db.Model):
    __tablename__ = 'merchandise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def __repr__(self):
        return f"<Merchandise {self.name}>"
    def __init__(self, name, description, price, image_url=None):
        self.name = name
        self.description = description
        self.price = price
        self.image_url = image_url
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, name, description, price, image_url=None):
        self.name = name
        self.description = description
        self.price = price
        self.image_url = image_url
        db.session.add(self)
        db.session.commit()
    def update(self, name=None, description=None, price=None, image_url=None):
        if name:
            self.name = name
        if description:
            self.description = description
        if price is not None:
            self.price = price
        if image_url:
            self.image_url = image_url
        db.session.commit()
    def get_by_id(self, merchandise_id):
        return Merchandise.query.get(merchandise_id)
    def get_by_name(self, name):
        return Merchandise.query.filter_by(name=name).first()
    def get_all(self):
        return Merchandise.query.all()
    def delete_by_id(self, merchandise_id):
        merchandise = Merchandise.query.get(merchandise_id)
        if merchandise:
            db.session.delete(merchandise)
            db.session.commit()
            return True
        return False
    def delete_by_name(self, name):
        merchandise = Merchandise.query.filter_by(name=name).first()
        if merchandise:
            db.session.delete(merchandise)
            db.session.commit()
            return True
        return False
    

class TeamProject(db.Model):
    
    __tablename__ = 'team_projects'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    role = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    responses = db.relationship('TeamResponse', backref='team_project')
    students = db.relationship('Student', backref='team_project')

    def serialize(self):
        return {
            "id": self.id,
            "project_id": self.project_id,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def save(self):
        db.session.add(self)
        db.session.commit()
        
    def create(self, project_id, role):
        self.project_id = project_id
        self.role = role
        self.save()
        db.session.commit()
    def update(self, project_id, role):
        self.project_id = project_id
        self.role = role
        self.save()
    def get_by_id(self, team_project_id):
        return TeamProject.query.get(team_project_id)
    def get_by_project_id(self, project_id):
        return TeamProject.query.filter_by(project_id=project_id).first()
    def get_all(self):
        return TeamProject.query.all()
    def delete_by_id(self, team_project_id):
        team_project = TeamProject.query.get(team_project_id)
        if team_project:
            db.session.delete(team_project)
            db.session.commit()
            return True
        return False    
    def delete_by_project_id(self, project_id):
        team_project = TeamProject.query.filter_by(project_id=project_id).first()
        if team_project:
            db.session.delete(team_project)
            db.session.commit()
            return True
        return False
        
class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='Pending')  # Pending, Completed, Failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    
    user = db.relationship('User', backref='orders')
    merchandise = db.relationship('Merchandise', secondary='order_items', backref='orders')
    
    def serialize(self):    
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f"<Order {self.id} for User {self.user_id}>"
    def __init__(self, user_id, total_amount, payment_status='Pending'):
        self.user_id = user_id
        self.total_amount = total_amount
        self.payment_status = payment_status
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, user_id, total_amount, payment_status='Pending'):
        self.user_id = user_id
        self.total_amount = total_amount
        self.payment_status = payment_status
        db.session.add(self)
        db.session.commit()
    def update(self, total_amount=None, payment_status=None):
        if total_amount is not None:
            self.total_amount = total_amount
        if payment_status is not None:
            self.payment_status = payment_status
        db.session.commit()
    def get_by_id(self, order_id):
        return Order.query.get(order_id)
    def get_by_user_id(self, user_id):
        return Order.query.filter_by(user_id=user_id).all()
    def get_all(self):
        return Order.query.all()
    def delete_by_id(self, order_id):
        order = Order.query.get(order_id)
        if order:
            db.session.delete(order)
            db.session.commit()
            return True
        return False
    def delete_by_user_id(self, user_id):
        orders = Order.query.filter_by(user_id=user_id).all()
        if orders:
            for order in orders:
                db.session.delete(order)
            db.session.commit()
            return True
        return False    
    def add_item(self, merchandise_id, quantity, unit_price):
        item = OrderItem(order_id=self.id, merchandise_id=merchandise_id, quantity=quantity, unit_price=unit_price)
        db.session.add(item)
        db.session.commit()
        self.total_amount += quantity * unit_price
        db.session.commit()
    def remove_item(self, item_id):
        item = OrderItem.query.get(item_id)
        if item and item.order_id == self.id:
            self.total_amount -= item.quantity * item.unit_price
            db.session.delete(item)
            db.session.commit()
        else:
            raise ValueError("Item not found in this order")
    
    def clear_items(self):
        items = OrderItem.query.filter_by(order_id=self.id).all()
        for item in items:
            self.total_amount -= item.quantity * item.unit_price
            db.session.delete(item)
        db.session.commit()
        
    def get_items(self):
        return OrderItem.query.filter_by(order_id=self.id).all()
class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)
    
    order = db.relationship('Order', backref='items')
    merchandise = db.relationship('Merchandise', backref='order_items')
    
    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "merchandise_id": self.merchandise_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price
        }

    def __repr__(self):
        return f"<OrderItem {self.id}>"

    def __init__(self, order_id, merchandise_id, quantity, unit_price):
        self.order_id = order_id
        self.merchandise_id = merchandise_id
        self.quantity = quantity
        self.unit_price = unit_price
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    def create(self, order_id, merchandise_id, quantity, unit_price):
        self.order_id = order_id
        self.merchandise_id = merchandise_id
        self.quantity = quantity
        self.unit_price = unit_price
        db.session.add(self)
        db.session.commit()
    def update(self, quantity=None, unit_price=None):
        if quantity is not None:
            self.quantity = quantity
        if unit_price is not None:
            self.unit_price = unit_price
        db.session.commit()
    def get_by_id(self, item_id):
        return OrderItem.query.get(item_id)
    def get_by_order_id(self, order_id):
        return OrderItem.query.filter_by(order_id=order_id).all()
    def get_by_merchandise_id(self, merchandise_id):
        return OrderItem.query.filter_by(merchandise_id=merchandise_id).all()
    def get_all(self):
        return OrderItem.query.all()
    def delete_by_id(self, item_id):
        item = OrderItem.query.get(item_id)
        if item:
            db.session.delete(item)
            db.session.commit()
            return True
        return False
    def delete_by_order_id(self, order_id):
        items = OrderItem.query.filter_by(order_id=order_id).all()
        if items:
            for item in items:
                db.session.delete(item)
            db.session.commit()
            return True
        return False
    def delete_by_merchandise_id(self, merchandise_id): 
        items = OrderItem.query.filter_by(merchandise_id=merchandise_id).all()
        if items:
            for item in items:
                db.session.delete(item)
            db.session.commit()
            return True
        return False
    def get_total_price(self):
        return self.quantity * self.unit_price
    def get_order(self):
        return Order.query.get(self.order_id)
    def get_merchandise(self):
        return Merchandise.query.get(self.merchandise_id)
    def get_quantity(self):
        return self.quantity
    def get_unit_price(self):
        return self.unit_price
    def get_order_items(self):
        return OrderItem.query.filter_by(order_id=self.order_id).all()

class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    logo_image_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    contact_requests = db.relationship('contact_requests', backref='company', lazy=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "website": self.website,
            "logo_url": self.logo_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
    def __repr__(self):
        return f"<Company {self.name}>"
    def __init__(self, name, email, description=None, logo_image_url=None, bio=None):
        self.name = name
        self.email = email
        self.description = description
        self.logo_image_url = logo_image_url
        self.bio = bio
        self.is_verified = False
        
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()  
    
    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, name, email, description=None, logo_image_url=None, bio=None):
        self.name = name
        self.email = email
        self.description = description
        self.logo_image_url = logo_image_url
        self.bio = bio
        db.session.add(self)
        db.session.commit()
    def update(self, name=None, email=None, description=None, logo_image_url=None, bio=None):
        if name:
            self.name = name
        if email:
            self.email = email
        if description:
            self.description = description
        if logo_image_url:
            self.logo_image_url = logo_image_url
        if bio:
            self.bio = bio
        db.session.commit()
    def get_by_id(self, company_id):
        return Company.query.get(company_id)
    def get_by_name(self, name):
        return Company.query.filter_by(name=name).first()
    def get_all(self):
        return Company.query.all()
    def delete_by_id(self, company_id):
        company = Company.query.get(company_id)
        if company:
            db.session.delete(company)
            db.session.commit()
            return True
        return False
    def delete_by_name(self, name):
        company = Company.query.filter_by(name=name).first()
        if company:
            db.session.delete(company)
            db.session.commit()
            return True
        return False
    def verify(self):
        self.is_verified = True
        db.session.commit() 
    def unverify(self):
        self.is_verified = False
        db.session.commit()
    def get_contact_requests(self):
        return ContactRequest.query.filter_by(company_id=self.id).all() 
    def add_contact_request(self, email, message):
        contact_request = ContactRequest(company_id=self.id, email=email, message=message)
        db.session.add(contact_request)
        db.session.commit()
        return contact_request
    def remove_contact_request(self, contact_request_id):
        contact_request = ContactRequest.query.get(contact_request_id)
        if contact_request and contact_request.company_id == self.id:
            db.session.delete(contact_request)
            db.session.commit()
            return True
        return False
    def get_contact_request_by_id(self, contact_request_id):
        return ContactRequest.query.filter_by(id=contact_request_id, company_id=self.id).first()
    def get_contact_requests_by_email(self, email):
        return ContactRequest.query.filter_by(company_id=self.id, email=email).all()
    def get_contact_requests_by_message(self, message):
        return ContactRequest.query.filter_by(company_id=self.id, message=message).all()
    
        
        
class ContactRequest(db.Model):
    __tablename__ = 'contact_requests'
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    company = db.relationship('Company', backref='contact_requests')
    
    def serialize(self):
        return {
            "id": self.id,
            "company_id": self.company_id,
            "email": self.email,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
    def __repr__(self):
        return f"<ContactRequest {self.id} for Company {self.company_id}>"
    def __init__(self, company_id, email, message):
        self.company_id = company_id
        self.email = email
        self.message = message
        self.created_at = datetime.utcnow()

    def save(self):
        db.session.add(self)
        db.session.commit()
    def create(self, company_id, email, message):       
        self.company_id = company_id
        self.email = email
        self.message = message
        db.session.add(self)
        db.session.commit()
    def update(self, email=None, message=None):
        if email:
            self.email = email
        if message:
            self.message = message
        db.session.commit()
    def get_by_id(self, contact_request_id):
        return ContactRequest.query.get(contact_request_id)
    def get_by_company_id(self, company_id):
        return ContactRequest.query.filter_by(company_id=company_id).all()
    def get_by_email(self, email):
        return ContactRequest.query.filter_by(email=email).all()
    def get_by_message(self, message):
        return ContactRequest.query.filter_by(message=message).all()
    def get_all(self):
        return ContactRequest.query.all()
    def delete_by_id(self, contact_request_id):
        contact_request = ContactRequest.query.get(contact_request_id)
        if contact_request:
            db.session.delete(contact_request)
            db.session.commit()
            return True
        return False
    def delete_by_company_id(self, company_id):
        contact_requests = ContactRequest.query.filter_by(company_id=company_id).all()
        if contact_requests:
            for request in contact_requests:
                db.session.delete(request)
            db.session.commit()
            return True
        return False
    def delete_by_email(self, email):
        contact_requests = ContactRequest.query.filter_by(email=email).all()
        if contact_requests:
            for request in contact_requests:
                db.session.delete(request)
            db.session.commit()
            return True
        return False
    def delete_by_message(self, message):
        contact_requests = ContactRequest.query.filter_by(message=message).all()
        if contact_requests:
            for request in contact_requests:
                db.session.delete(request)
            db.session.commit()
            return True
        return False    
    def get_company(self):
        return Company.query.get(self.company_id)
    def get_email(self):
        return self.email
    def get_message(self):
        return self.message
