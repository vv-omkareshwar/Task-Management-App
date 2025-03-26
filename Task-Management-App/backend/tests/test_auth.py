import unittest
from unittest.mock import patch, MagicMock
from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from jsonschema import ValidationError

# Mock implementations of external dependencies
class MockUser:
    @staticmethod
    def find_user_by_email(email):
        return mock_db.get(email)

    @staticmethod
    def find_user_by_id(user_id):
        for user in mock_db.values():
            if str(user['_id']) == user_id:
                return user
        return None

    @staticmethod
    def create_user(user_data):
        user_id = len(mock_db) + 1
        user_data['_id'] = user_id
        mock_db[user_data['email']] = user_data
        return user_id

    @staticmethod
    def update_user(user_id, update_data):
        for user in mock_db.values():
            if str(user['_id']) == user_id:
                user.update(update_data)
                return True
        return False

# Mock database
mock_db = {}

# Utility functions
def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, 'secret_key', algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, 'secret_key', algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Import functions from auth_controller
from auth_controller import register_user, login_user, get_user, change_password

class TestAuthController(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()
        mock_db.clear()

    @patch('auth_controller.User', MockUser)
    @patch('auth_controller.generate_token', generate_token)
    def test_register_user_success(self):
        with self.app.test_request_context('/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        }):
            response = register_user()
            data = response[0].json
            self.assertEqual(response[1], 201)
            self.assertTrue(data['success'])
            self.assertIn('authtoken', data)

    @patch('auth_controller.User', MockUser)
    def test_register_user_existing_email(self):
        mock_db['john@example.com'] = {'name': 'John Doe', 'email': 'john@example.com', 'password': 'hashed_password'}
        with self.app.test_request_context('/register', json={
            'name': 'John Doe',
            'email': 'john@example.com',
            'password': 'password123'
        }):
            response = register_user()
            data = response[0].json
            self.assertEqual(response[1], 400)
            self.assertFalse(data['success'])
            self.assertEqual(data['error'], "Sorry, a user with this email already exists")

    @patch('auth_controller.User', MockUser)
    @patch('auth_controller.check_password_hash', lambda x, y: True)
    @patch('auth_controller.generate_token', generate_token)
    def test_login_user_success(self):
        mock_db['john@example.com'] = {'_id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'password': 'hashed_password'}
        with self.app.test_request_context('/login', json={
            'email': 'john@example.com',
            'password': 'password123'
        }):
            response = login_user()
            data = response[0].json
            self.assertEqual(response[1], 200)
            self.assertTrue(data['success'])
            self.assertIn('authtoken', data)

    @patch('auth_controller.User', MockUser)
    @patch('auth_controller.check_password_hash', lambda x, y: False)
    def test_login_user_invalid_credentials(self):
        mock_db['john@example.com'] = {'_id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'password': 'hashed_password'}
        with self.app.test_request_context('/login', json={
            'email': 'john@example.com',
            'password': 'wrong_password'
        }):
            response = login_user()
            data = response[0].json
            self.assertEqual(response[1], 400)
            self.assertFalse(data['success'])
            self.assertEqual(data['error'], "Please try to login with correct credentials")

    @patch('auth_controller.User', MockUser)
    @patch('auth_controller.verify_token', lambda x: '1')
    def test_get_user_success(self):
        mock_db['john@example.com'] = {'_id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'password': 'hashed_password'}
        with self.app.test_request_context('/user', headers={'Authorization': 'valid_token'}):
            response = get_user()
            data = response[0].json
            self.assertEqual(response[1], 200)
            self.assertEqual(data['id'], '1')
            self.assertEqual(data['name'], 'John Doe')
            self.assertEqual(data['email'], 'john@example.com')

    @patch('auth_controller.verify_token', lambda x: None)
    def test_get_user_invalid_token(self):
        with self.app.test_request_context('/user', headers={'Authorization': 'invalid_token'}):
            response = get_user()
            data = response[0].json
            self.assertEqual(response[1], 401)
            self.assertEqual(data['error'], 'Invalid token')

    @patch('auth_controller.User', MockUser)
    def test_change_password_success(self):
        mock_db['john@example.com'] = {'_id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'password': 'old_hashed_password'}
        with self.app.test_request_context('/change-password', json={
            'email': 'john@example.com',
            'newPassword': 'new_password123'
        }):
            response = change_password()
            data = response[0].json
            self.assertEqual(response[1], 200)
            self.assertTrue(data['success'])
            self.assertEqual(data['message'], "Password changed successfully")

    def test_change_password_missing_data(self):
        with self.app.test_request_context('/change-password', json={
            'email': 'john@example.com'
        }):
            response = change_password()
            data = response[0].json
            self.assertEqual(response[1], 400)
            self.assertFalse(data['success'])
            self.assertEqual(data['error'], "Email and new password are required")

    @patch('auth_controller.User', MockUser)
    def test_change_password_user_not_found(self):
        with self.app.test_request_context('/change-password', json={
            'email': 'nonexistent@example.com',
            'newPassword': 'new_password123'
        }):
            response = change_password()
            data = response[0].json
            self.assertEqual(response[1], 400)
            self.assertFalse(data['success'])
            self.assertEqual(data['error'], "User not found")

if __name__ == '__main__':
    unittest.main()