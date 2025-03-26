from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from utils.auth_utils import generate_token, verify_token
from flask_expects_json import expects_json
from jsonschema import ValidationError

# JSON schemas for request validation
register_schema = {
    'type': 'object',
    'properties': {
        'name': {'type': 'string', 'minLength': 3},
        'email': {'type': 'string', 'format': 'email'},
        'password': {'type': 'string', 'minLength': 5}
    },
    'required': ['name', 'email', 'password']
}

login_schema = {
    'type': 'object',
    'properties': {
        'email': {'type': 'string', 'format': 'email'},
        'password': {'type': 'string'}
    },
    'required': ['email', 'password']
}

@expects_json(register_schema)
def register_user():
    try:
        data = request.get_json()
        name = data['name']
        email = data['email']
        password = data['password']

        existing_user = User.find_user_by_email(email)
        if existing_user:
            return jsonify({'success': False, 'error': "Sorry, a user with this email already exists"}), 400

        hashed_password = generate_password_hash(password)
        user_data = {
            'name': name,
            'email': email,
            'password': hashed_password
        }
        user_id = User.create_user(user_data)

        token = generate_token(str(user_id))
        return jsonify({'success': True, 'authtoken': token}), 201
    except ValidationError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': "Internal server error occurred"}), 500

@expects_json(login_schema)
def login_user():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = User.find_user_by_email(email)
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'success': False, 'error': "Please try to login with correct credentials"}), 400

        token = generate_token(str(user['_id']))
        return jsonify({'success': True, 'authtoken': token}), 200
    except ValidationError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': "Internal server error occurred"}), 500

def get_user():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid token'}), 401

        user = User.find_user_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_data = {
            'id': str(user['_id']),
            'name': user['name'],
            'email': user['email']
        }
        return jsonify(user_data), 200
    except Exception as e:
        return jsonify({'error': "Internal server error occurred"}), 500

def change_password():
    try:
        data = request.get_json()
        email = data.get('email')
        new_password = data.get('newPassword')

        if not email or not new_password:
            return jsonify({'success': False, 'error': "Email and new password are required"}), 400

        if len(new_password) < 5:
            return jsonify({'success': False, 'error': "New password must be at least 5 characters"}), 400

        user = User.find_user_by_email(email)
        if not user:
            return jsonify({'success': False, 'error': "User not found"}), 400

        hashed_password = generate_password_hash(new_password)
        User.update_user(str(user['_id']), {'password': hashed_password})

        return jsonify({'success': True, 'message': "Password changed successfully"}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': "Internal server error occurred"}), 500