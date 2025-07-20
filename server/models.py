from flask import Flask # Added Flask import (even if not directly used in models, it's common to have it)
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData, func
from sqlalchemy.schema import UniqueConstraint # Import for composite primary key
from werkzeug.security import generate_password_hash, check_password_hash

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True) 
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    profile_pic_url = db.Column(db.String)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now()) 
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now()) 
    
    # Relationship
    reviews = db.relationship('Review', backref='reviewer', lazy=True)
    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role,
            "profile_pic_url": self.profile_pic_url,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, username, first_name, last_name, email, password, role="user", profile_pic_url=None):
        user = cls(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role=role,
            profile_pic_url=profile_pic_url
        )
        user.set_password(password)
        user.save()
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

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    github = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    role = db.Column(db.String(50), default="student")
    skills = db.Column(db.Text) 

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    # Relationship for projects owned by the student
    projects = db.relationship("Project", backref="student_rel", lazy=True)

    # Relationship for projects where the student is a team member - hio ni biz logic
    projects_as_member = db.relationship(
        "TeamProject",
        foreign_keys="[TeamProject.student_id]",
        back_populates="student_member", 
        lazy=True,
        cascade="all, delete-orphan"
    )

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
            "skills": self.skills, # Include skills in serialization
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name, email, password, github=None, linkedin=None, skills=None): # Added skills parameter
        student = cls(name=name, email=email, github=github, linkedin=linkedin, skills=skills)
        student.set_password(password)
        student.save()
        return student

    @classmethod
    def get_by_id(cls, student_id):
        return cls.query.get(student_id)

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
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

    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)


    team_members = db.relationship(
        "TeamProject",
        foreign_keys="[TeamProject.project_id]",
        back_populates="project_team", 
        lazy=True,
        cascade="all, delete-orphan" 
    )

    def __repr__(self):
        
        student_name = self.student_rel.name if self.student_rel else "Unknown Student"
        return f"<Project {self.title} by {student_name}>"

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
            "student_id": self.student_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "team_members": [tm.serialize() for tm in self.team_members] # Include team members
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, title, category, description, github_link, student_id, demo_link=None, for_sale=False, price=0.0, file_url=None, status="Pending"):
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
        return cls.query.get(project_id)

    @classmethod
    def get_by_title(cls, title):
        return cls.query.filter_by(title=title).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    
    @classmethod
    def search_and_filter(cls, query=None, category=None, technology=None, student_name=None, status="Approved"):
        q = cls.query
        if query:
            q = q.filter(
                (cls.title.ilike(f'%{query}%')) |
                (cls.description.ilike(f'%{query}%'))
            )
        if category:
            q = q.filter_by(category=category)
        if technology:
            q = q.filter(cls.description.ilike(f'%{technology}%')) 
        if student_name:
            q = q.join(Student, cls.student_id == Student.id).filter(Student.name.ilike(f'%{student_name}%'))
        if status:
            q = q.filter_by(status=status)
        return q.all()

    def add_team_member(self, student_id, role="Member"):
        existing_member = TeamProject.query.filter_by(project_id=self.id, student_id=student_id).first()
        if existing_member:
            print(f"Student {student_id} is already a member of project {self.id}.")
            return existing_member

        team_member = TeamProject.create(project_id=self.id, student_id=student_id, role=role)
        return team_member

    def remove_team_member(self, student_id):
        """Removes a student from this project's team."""
        team_member = TeamProject.query.filter_by(project_id=self.id, student_id=student_id).first()
        if team_member:
            team_member.delete()
            return True
        return False

class TeamProject(db.Model):
    __tablename__ = 'team_projects'

    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), primary_key=True)
    role = db.Column(db.String(100)) 

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    
    student_member = db.relationship("Student", back_populates="projects_as_member")
    project_team = db.relationship("Project", back_populates="team_members")

   
    __table_args__ = (UniqueConstraint('student_id', 'project_id', name='_student_project_uc'),)

    def __repr__(self):
        return f"<TeamProject Student:{self.student_id} Project:{self.project_id} Role:{self.role}>"

    def serialize(self):
        return {
            "student_id": self.student_id,
            "project_id": self.project_id,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "student_name": self.student_member.name if self.student_member else None 
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, student_id, project_id, role="Member"):
        team_project = cls(student_id=student_id, project_id=project_id, role=role)
        team_project.save()
        return team_project

    @classmethod
    def get_by_student_and_project(cls, student_id, project_id):
        return cls.query.filter_by(student_id=student_id, project_id=project_id).first()

    @classmethod
    def get_all_for_project(cls, project_id):
        return cls.query.filter_by(project_id=project_id).all()

    @classmethod
    def get_all_for_student(cls, student_id):
        return cls.query.filter_by(student_id=student_id).all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class TeamResponse(db.Model):
    __tablename__ = 'team_responses'
    id = db.Column(db.Integer, primary_key=True)
    team_project_id = db.Column(db.Integer, db.ForeignKey('team_projects.student_id', name='fk_team_project_student_id'), nullable=False), db.Column(db.Integer, db.ForeignKey('team_projects.project_id', name='fk_team_project_project_id'), nullable=False) 
    response_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    team_project_student_id = db.Column(db.Integer, db.ForeignKey('team_projects.student_id'), nullable=False)
    team_project_project_id = db.Column(db.Integer, db.ForeignKey('team_projects.project_id'), nullable=False)

    
    __table_args__ = (
        db.ForeignKeyConstraint(
            ['team_project_student_id', 'team_project_project_id'],
            ['team_projects.student_id', 'team_projects.project_id']
        ),
    )


    team_project_rel = db.relationship(
        "TeamProject",
        primaryjoin="and_(TeamResponse.team_project_student_id == TeamProject.student_id, "
                    "TeamResponse.team_project_project_id == TeamProject.project_id)",
        backref="responses",
        lazy=True
    )

    def serialize(self):
        return {
            "id": self.id,
            "team_project_student_id": self.team_project_student_id,
            "team_project_project_id": self.team_project_project_id,
            "response_text": self.response_text,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, team_project_student_id, team_project_project_id, response_text):
        team_response = cls(
            team_project_student_id=team_project_student_id,
            team_project_project_id=team_project_project_id,
            response_text=response_text
        )
        team_response.save()
        return team_response

    @classmethod
    def get_by_id(cls, response_id):
        return cls.query.get(response_id)

    @classmethod
    def get_by_team_project_composite_id(cls, student_id, project_id):
        return cls.query.filter_by(team_project_student_id=student_id, team_project_project_id=project_id).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())



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

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, project_id, reviewer_id, rating, comment=None):
        review = cls(project_id=project_id, reviewer_id=reviewer_id, rating=rating, comment=comment)
        review.save()
        return review

    @classmethod
    def get_by_id(cls, review_id):
        return cls.query.get(review_id)

    @classmethod
    def get_by_project_id(cls, project_id):
        return cls.query.filter_by(project_id=project_id).all()

    @classmethod
    def get_by_reviewer_id(cls, reviewer_id):
        return cls.query.filter_by(reviewer_id=reviewer_id).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Merchandise(db.Model):
    __tablename__ = 'merchandise'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

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

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name, description, price, image_url=None):
        merchandise = cls(name=name, description=description, price=price, image_url=image_url)
        merchandise.save()
        return merchandise

    @classmethod
    def get_by_id(cls, merchandise_id):
        return cls.query.get(merchandise_id)

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String(50), default='Pending')
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "items": [item.serialize() for item in self.items] # Include order items
        }

    def __repr__(self):
        return f"<Order {self.id} for User {self.user_id}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, user_id, total_amount=0.0, payment_status='Pending'):
        order = cls(user_id=user_id, total_amount=total_amount, payment_status=payment_status)
        order.save()
        return order

    @classmethod
    def get_by_id(cls, order_id):
        return cls.query.get(order_id)

    @classmethod
    def get_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def add_item(self, merchandise_id, quantity, unit_price):
        item = OrderItem.create(order_id=self.id, merchandise_id=merchandise_id, quantity=quantity, unit_price=unit_price)
        self.total_amount += quantity * unit_price
        self.save() 
        return item

    def remove_item(self, item_id):
        item = OrderItem.get_by_id(item_id)
        if item and item.order_id == self.id:
            self.total_amount -= item.quantity * item.unit_price
            item.delete() 
            self.save() 
            return True
        else:
            raise ValueError("Item not found in this order or does not belong to it.")

    def clear_items(self):
        items = OrderItem.get_by_order_id(self.id)
        for item in items:
            item.delete() 
        self.total_amount = 0.0 
        self.save()
        return True

    def get_items(self):
        return self.items

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    merchandise_id = db.Column(db.Integer, db.ForeignKey('merchandise.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    unit_price = db.Column(db.Float, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "merchandise_id": self.merchandise_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.get_total_price() 
        }

    def __repr__(self):
        return f"<OrderItem {self.id} (Order: {self.order_id}, Merchandise: {self.merchandise_id})>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, order_id, merchandise_id, quantity, unit_price):
        order_item = cls(order_id=order_id, merchandise_id=merchandise_id, quantity=quantity, unit_price=unit_price)
        order_item.save()
        return order_item

    @classmethod
    def get_by_id(cls, item_id):
        return cls.query.get(item_id)

    @classmethod
    def get_by_order_id(cls, order_id):
        return cls.query.filter_by(order_id=order_id).all()

    @classmethod
    def get_by_merchandise_id(cls, merchandise_id):
        return cls.query.filter_by(merchandise_id=merchandise_id).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        if 'quantity' in kwargs and kwargs['quantity'] is not None:
            old_quantity = self.quantity
            self.quantity = kwargs['quantity']
            self.order.total_amount += (self.quantity - old_quantity) * self.unit_price
        if 'unit_price' in kwargs and kwargs['unit_price'] is not None:
            old_unit_price = self.unit_price
            self.unit_price = kwargs['unit_price']
            self.order.total_amount += self.quantity * (self.unit_price - old_unit_price)

        self.save()
        self.order.save()

    def delete(self):
      
        if self.order:
            self.order.total_amount -= self.quantity * self.unit_price
            self.order.save()
        db.session.delete(self)
        db.session.commit()

    def get_total_price(self):
        return self.quantity * self.unit_price

class Company(db.Model):
    __tablename__ = 'companies'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    logo_image_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    contact_requests = db.relationship('ContactRequest', backref='company_rel', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "description": self.description,
            "logo_image_url": self.logo_image_url,
            "bio": self.bio,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Company {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name, email, description=None, logo_image_url=None, bio=None):
        company = cls(name=name, email=email, description=description, logo_image_url=logo_image_url, bio=bio)
        company.save()
        return company

    @classmethod
    def get_by_id(cls, company_id):
        return cls.query.get(company_id)

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def verify(self):
        self.is_verified = True
        self.save()

    def unverify(self):
        self.is_verified = False
        self.save()

    def get_contact_requests(self):
        return self.contact_requests

    def add_contact_request(self, email, message):
        contact_request = ContactRequest.create(company_id=self.id, email=email, message=message)
        return contact_request

    def remove_contact_request(self, contact_request_id):
        contact_request = ContactRequest.get_by_id(contact_request_id)
        if contact_request and contact_request.company_id == self.id:
            contact_request.delete()
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
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

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

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, company_id, email, message):
        contact_request = cls(company_id=company_id, email=email, message=message)
        contact_request.save()
        return contact_request

    @classmethod
    def get_by_id(cls, contact_request_id):
        return cls.query.get(contact_request_id)

    @classmethod
    def get_by_company_id(cls, company_id):
        return cls.query.filter_by(company_id=company_id).all()

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).all()

    @classmethod
    def get_by_message(cls, message):
        return cls.query.filter_by(message=message).all()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
