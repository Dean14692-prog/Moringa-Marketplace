
# Google OAuth2.0 integration for Moringa Marketplace
import os
from flask import Blueprint, redirect, request, url_for, jsonify, make_response
from google.oauth2 import id_token
from google.auth.transport import requests
import jwt
from models import db, User, Role
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_cors import cross_origin

# Initialize blueprint
google_oauth_bp = Blueprint('google_oauth', __name__)

# Google OAuth2.0 Configuration
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')

@google_oauth_bp.route('/auth/google', methods=['POST'])
@cross_origin(supports_credentials=True)
def google_auth():
    """Handle Google OAuth2.0 authentication"""
    
    token = request.json.get('credential')
    
    if not token:
        return jsonify({"msg": "No token provided"}), 400
    
    try:
        # Verify the Google ID token
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # Check if user exists in database
        user = User.query.filter_by(email=idinfo['email']).first()
        
        if not user:
            # Create new user if they don't exist
            user_role = Role.query.filter_by(name='user').first()
            if not user_role:
                user_role = Role(name='user')
                db.session.add(user_role)
                db.session.commit()
            
            user = User(
                username=idinfo.get('given_name', '') + idinfo.get('family_name', '')[:3] + idinfo.get('sub', '')[-4:],
                email=idinfo['email'],
                first_name=idinfo.get('given_name', ''),
                last_name=idinfo.get('family_name', ''),
                profile_pic=idinfo.get('picture', ''),
                role=user_role,
                is_google_auth=True
            )
            db.session.add(user)
            db.session.commit()
        
        # Generate JWT tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_pic': user.profile_pic,
                'is_google_auth': True
            }
        }), 200
        
    except ValueError as e:
        # Invalid token
        return jsonify({"msg": "Invalid token", "error": str(e)}), 401
    except Exception as e:
        return jsonify({"msg": "Authentication failed", "error": str(e)}), 500