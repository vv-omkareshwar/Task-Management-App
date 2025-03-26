from flask import Blueprint, request, jsonify
from flask_expects_json import expects_json
from controllers.auth_controller import login_user, register_user, get_user_by_id
from utils.auth_utils import verify_token

auth_bp = Blueprint('auth', __name__)

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

@auth_bp.route('/signup', methods=['POST'])
@expects_json(register_schema)
def signup():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    result = register_user(name, email, password)
    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400
    return jsonify({'success': True, 'authtoken': result['authtoken']}), 201

@auth_bp.route('/login', methods=['POST'])
@expects_json(login_schema)
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    result = login_user(email, password)
    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400
    return jsonify({'success': True, 'authtoken': result['authtoken']}), 200

@auth_bp.route('/userdetails', methods=['GET'])
def get_user_details():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'No token provided'}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401

    user = get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user), 200

@auth_bp.route('/user', methods=['PUT'])
@expects_json(login_schema)
def change_password():
    data = request.get_json()
    email = data['email']
    new_password = data['password']

    result = login_user(email, new_password, change_password=True)
    if 'error' in result:
        return jsonify({'success': False, 'error': result['error']}), 400
    return jsonify({'success': True, 'message': "Password changed successfully"}), 200