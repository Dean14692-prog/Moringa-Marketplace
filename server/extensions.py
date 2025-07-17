# extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

# Initialize extensions without binding them to an app instance yet
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()