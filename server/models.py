from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, func
from sqlalchemy.schema import UniqueConstraint
from sqlalchemy.orm import validates, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Define metadata for consistent naming conventions
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    bio = db.Column(db.Text)
    profile_pic = db.Column(db.String(255))
    github = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    skills = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    
    role = relationship('Role', back_populates='users')
    
    users_projects_link = relationship('UsersProject', back_populates='user', lazy=True, cascade="all, delete-orphan")
    orders = relationship('Order', back_populates='user', lazy=True, cascade="all, delete-orphan")


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
            "role_id": self.role_id,
            "role_name": self.role.name if self.role else None,
            "bio": self.bio,
            "profile_pic": self.profile_pic,
            "github": self.github,
            "linkedin": self.linkedin,
            "skills": self.skills,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, username, first_name, last_name, email, password, role_id, bio=None, profile_pic=None, github=None, linkedin=None, skills=None):
        user = cls(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            role_id=role_id,
            bio=bio,
            profile_pic=profile_pic,
            github=github,
            linkedin=linkedin,
            skills=skills
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

class Role(db.Model):
    __tablename__ = 'roles'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    users = relationship('User', back_populates='role', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name):
        role = cls(name=name)
        role.save()
        return role

    @classmethod
    def get_by_id(cls, role_id):
        return cls.query.get(role_id)

    @classmethod
    def get_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    tech_stack = db.Column(db.String(255))
    github_link = db.Column(db.String(255), nullable=False)
    live_preview_url = db.Column(db.String(255))
    isForSale = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float, default=0.0)
    isApproved = db.Column(db.Boolean, default=False)
    
    status_changed_by = db.Column(db.String(255)) 
    uploaded_by = db.Column(db.String(255), nullable=False) 
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    users_projects_link = relationship('UsersProject', back_populates='project', lazy=True, cascade="all, delete-orphan")

    reviews_through_users_projects = relationship(
        'Review',
        secondary='users_projects',
        primaryjoin="Project.id == UsersProject.project_id",
        secondaryjoin="UsersProject.id == Review.user_project_id",
        viewonly=True,
        lazy=True
    )

    def __repr__(self):
        return f"<Project {self.title}>"

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "description": self.description,
            "tech_stack": self.tech_stack,
            "github_link": self.github_link,
            "live_preview_url": self.live_preview_url,
            "isForSale": self.isForSale,
            "price": self.price,
            "isApproved": self.isApproved,
            "status_changed_by": self.status_changed_by,
            "uploaded_by": self.uploaded_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "team_members_and_actions": [up.serialize() for up in self.users_projects_link], 
            "reviews_count": len(self.reviews_through_users_projects)
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, title, description, category, github_link, uploaded_by, tech_stack=None, live_preview_url=None, isForSale=False, price=0.0, isApproved=False, status_changed_by=None):
        project = cls(
            title=title,
            description=description,
            category=category,
            tech_stack=tech_stack,
            github_link=github_link,
            live_preview_url=live_preview_url,
            isForSale=isForSale,
            price=price,
            isApproved=isApproved,
            status_changed_by=status_changed_by,
            uploaded_by=uploaded_by
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
            q = q.filter(cls.uploaded_by.ilike(f'%{uploaded_by}%')) 
        if isApproved is not None:
            q = q.filter_by(isApproved=isApproved)
        return q.all()

class UsersProject(db.Model):
    __tablename__ = 'users_projects'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    action = db.Column(db.String(100)) 
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = relationship('User', back_populates='users_projects_link')
    project = relationship('Project', back_populates='users_projects_link')
    reviews_link = relationship('Review', back_populates='users_project', lazy=True, cascade="all, delete-orphan")

    # Removed UniqueConstraint('user_id', 'project_id') to allow multiple actions per user/project
    # If a user can perform multiple actions (upload, comment, like) on the same project,
    # then (user_id, project_id) is not unique. If you need uniqueness per action,
    # you'd need UniqueConstraint('user_id', 'project_id', 'action').

    def __repr__(self):
        return f"<UsersProject User:{self.user_id} Project:{self.project_id} Action:{self.action}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username if self.user else None,
            "project_id": self.project_id,
            "project_title": self.project.title if self.project else None,
            "action": self.action,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, user_id, project_id, action=None):
        users_project = cls(user_id=user_id, project_id=project_id, action=action)
        users_project.save()
        return users_project

    @classmethod
    def get_by_id(cls, users_project_id):
        return cls.query.get(users_project_id)

    @classmethod
    def get_by_user_and_project(cls, user_id, project_id, action=None):
        
        q = cls.query.filter_by(user_id=user_id, project_id=project_id)
        if action:
            q = q.filter_by(action=action)
        return q.first()

    @classmethod
    def get_all_for_project(cls, project_id):
        return cls.query.filter_by(project_id=project_id).all()

    @classmethod
    def get_all_for_user(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

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
    user_project_id = db.Column(db.Integer, db.ForeignKey('users_projects.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    users_project = relationship('UsersProject', back_populates='reviews_link')

    def serialize(self):
        
        project_title = self.users_project.project.title if self.users_project and self.users_project.project else None
        reviewer_username = self.users_project.user.username if self.users_project and self.users_project.user else None
        reviewer_user_id = self.users_project.user.id if self.users_project and self.users_project.user else None


        return {
            "id": self.id,
            "user_project_id": self.user_project_id,
            "project_id": self.users_project.project_id if self.users_project else None,
            "project_title": project_title,
            "reviewer_user_id": reviewer_user_id, 
            "reviewer_username": reviewer_username,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, user_project_id, rating, comment=None):
        review = cls(user_project_id=user_project_id, rating=rating, comment=comment)
        review.save()
        return review

    @classmethod
    def get_by_id(cls, review_id):
        return cls.query.get(review_id)

    @classmethod
    def get_by_user_project_id(cls, user_project_id):
        return cls.query.filter_by(user_project_id=user_project_id).all()

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
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    order_items = relationship('OrderItem', back_populates='merchandise', lazy=True,cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "stock_quantity": self.stock_quantity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Merchandise {self.name}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def create(cls, name, description=None, price=0.0, image_url=None, stock_quantity=0):
        merchandise = cls(name=name, description=description, price=price, image_url=image_url, stock_quantity=stock_quantity)
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
    payment_status = db.Column(db.String(50), nullable=False, default='Pending')
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = relationship('User', back_populates='orders')
    items = relationship('OrderItem', back_populates='order', lazy=True, cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "payment_status": self.payment_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "items": [item.serialize() for item in self.items]
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
        existing_item = OrderItem.query.filter_by(order_id=self.id, merchandise_id=merchandise_id).first()
        if existing_item:
            existing_item.update(quantity=existing_item.quantity + quantity)
        else:
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
        for item in self.items:
            db.session.delete(item)
        self.total_amount = 0.0
        db.session.commit()
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

    order = relationship('Order', back_populates='items')
    merchandise = relationship('Merchandise', back_populates='order_items')

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "merchandise_id": self.merchandise_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "total_price": self.get_total_price(),
            "merchandise_name": self.merchandise.name if self.merchandise else None
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
        old_quantity = self.quantity
        old_unit_price = self.unit_price

        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

        if self.order:
            quantity_diff = self.quantity - old_quantity
            unit_price_diff = self.unit_price - old_unit_price

            self.order.total_amount += (quantity_diff * self.unit_price) + (self.quantity * unit_price_diff)
            self.order.save()

        self.save()

    def delete(self):
        if self.order:
            self.order.total_amount -= self.quantity * self.unit_price
            self.order.save()
        db.session.delete(self)
        db.session.commit()

    def get_total_price(self):
        return self.quantity * self.unit_price
