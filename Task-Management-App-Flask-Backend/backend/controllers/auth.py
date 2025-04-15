from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from marshmallow import Schema, fields, validate, ValidationError
from datetime import timedelta
import os

from models.user import User
from utils.helpers import require_auth

auth = Blueprint('auth', __name__)

class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=3))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=5))

user_schema = UserSchema()

@auth.route('/signup', methods=['POST'])
def create_user():
    try:
        data = user_schema.load(request.json)
    except ValidationError as err:
        return jsonify({"success": False, "errors": err.messages}), 400

    if User.objects(email=data['email']).first():
        return jsonify({"success": False, "error": "Sorry, a user with this email already exists"}), 400

    hashed_password = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    new_user.save()

    access_token = create_access_token(identity=str(new_user.id), expires_delta=timedelta(hours=1))
    return jsonify({"success": True, "authtoken": access_token}), 201

@auth.route('/login', methods=['POST'])
def login_user():
    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"success": False, "error": "Please provide both email and password"}), 400

    user = User.objects(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"success": False, "error": "Please try to login with correct credentials"}), 400

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=28))
    return jsonify({"success": True, "authtoken": access_token}), 200

@auth.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "date": user.date.isoformat()
    }), 200

@auth.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    email = request.json.get('email', None)
    new_password = request.json.get('newPassword', None)

    if not email or not new_password:
        return jsonify({"success": False, "error": "Please provide both email and new password"}), 400

    if len(new_password) < 5:
        return jsonify({"success": False, "error": "New password must be at least 5 characters"}), 400

    user = User.objects(email=email).first()
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404

    hashed_password = generate_password_hash(new_password)
    user.password = hashed_password
    user.save()

    return jsonify({"success": True, "message": "Password changed successfully"}), 200