import jwt
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get JWT secret from environment variable
JWT_SECRET = os.getenv('JWT')

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get the token from the 'auth-token' header
        token = request.headers.get('auth-token')
        
        if not token:
            return jsonify({"error": "Please authenticate using a valid token"}), 401

        try:
            # Verify the token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # Add user data to the request object
            request.user = data['user']
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated