# models.py

from extensions import db # <--- NEW: Import 'db' from extensions.py
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.sql import func

# --- STUDENT MODEL ---
class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    github = db.Column(db.String(255))
    linkedin = db.Column(db.String(255))
    role = db.Column(db.String(50), default="student")
    skills = db.Column(db.String(500))
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
            "skills": self.skills.split(',') if self.skills else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

# --- PROJECT MODEL ---
class Project(db.Model):
    __tablename__ = "projects"
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
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }