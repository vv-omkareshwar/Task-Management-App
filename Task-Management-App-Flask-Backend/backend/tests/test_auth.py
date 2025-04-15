import unittest
from unittest.mock import patch, MagicMock
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json

# Mock implementations
class MockFlask:
    def __init__(self):
        self.routes = {}

    def route(self, route, methods=None):
        def decorator(f):
            self.routes[route] = f
            return f
        return decorator

class MockRequest:
    def __init__(self, json_data):
        self.json = json_data

class MockResponse:
    def __init__(self, data, status_code):
        self.data = json.dumps(data)
        self.status_code = status_code

    def get_json(self):
        return json.loads(self.data)

class MockUser:
    def __init__(self, id, name, email, password, date):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.date = date

    @classmethod
    def objects(cls, **kwargs):
        return MockUserQuerySet(**kwargs)

class MockUserQuerySet:
    def __init__(self, **kwargs):
        self.filters = kwargs
        self.users = [
            MockUser("1", "Test User", "test@example.com", generate_password_hash("password123"), datetime.utcnow())
        ]

    def first(self):
        for user in self.users:
            if all(getattr(user, k) == v for k, v in self.filters.items()):
                return user
        return None

    def save(self):
        pass

# Utility functions
def create_access_token(identity, expires_delta):
    return f"mock_token_{identity}"

def get_jwt_identity():
    return "1"

# Test class
class TestAuthModule(unittest.TestCase):
    def setUp(self):
        self.app = MockFlask()
        self.client = self.app
        
        # Import and initialize the auth module
        from auth import auth, create_user, login_user, get_user, change_password
        self.auth = auth

    def test_create_user_success(self):
        with patch('auth.request', MockRequest({
            "name": "New User",
            "email": "newuser@example.com",
            "password": "newpassword123"
        })):
            with patch('auth.User.objects') as mock_objects:
                mock_objects.return_value.first.return_value = None
                response = self.auth.routes['/signup']()
                self.assertEqual(response.status_code, 201)
                self.assertTrue(response.get_json()['success'])
                self.assertIn('authtoken', response.get_json())

    def test_create_user_existing_email(self):
        with patch('auth.request', MockRequest({
            "name": "Existing User",
            "email": "test@example.com",
            "password": "password123"
        })):
            response = self.auth.routes['/signup']()
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.get_json()['success'])
            self.assertIn('error', response.get_json())

    def test_login_user_success(self):
        with patch('auth.request', MockRequest({
            "email": "test@example.com",
            "password": "password123"
        })):
            response = self.auth.routes['/login']()
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.get_json()['success'])
            self.assertIn('authtoken', response.get_json())

    def test_login_user_invalid_credentials(self):
        with patch('auth.request', MockRequest({
            "email": "test@example.com",
            "password": "wrongpassword"
        })):
            response = self.auth.routes['/login']()
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.get_json()['success'])
            self.assertIn('error', response.get_json())

    @patch('auth.jwt_required')
    @patch('auth.get_jwt_identity')
    def test_get_user_success(self, mock_get_jwt_identity, mock_jwt_required):
        mock_get_jwt_identity.return_value = "1"
        mock_jwt_required.return_value = None
        response = self.auth.routes['/user']()
        self.assertEqual(response.status_code, 200)
        self.assertIn('id', response.get_json())
        self.assertIn('name', response.get_json())
        self.assertIn('email', response.get_json())
        self.assertIn('date', response.get_json())

    @patch('auth.jwt_required')
    @patch('auth.get_jwt_identity')
    def test_get_user_not_found(self, mock_get_jwt_identity, mock_jwt_required):
        mock_get_jwt_identity.return_value = "999"  # Non-existent user ID
        mock_jwt_required.return_value = None
        response = self.auth.routes['/user']()
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.get_json())

    @patch('auth.jwt_required')
    def test_change_password_success(self, mock_jwt_required):
        mock_jwt_required.return_value = None
        with patch('auth.request', MockRequest({
            "email": "test@example.com",
            "newPassword": "newpassword123"
        })):
            response = self.auth.routes['/change-password']()
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.get_json()['success'])
            self.assertIn('message', response.get_json())

    @patch('auth.jwt_required')
    def test_change_password_user_not_found(self, mock_jwt_required):
        mock_jwt_required.return_value = None
        with patch('auth.request', MockRequest({
            "email": "nonexistent@example.com",
            "newPassword": "newpassword123"
        })):
            response = self.auth.routes['/change-password']()
            self.assertEqual(response.status_code, 404)
            self.assertFalse(response.get_json()['success'])
            self.assertIn('error', response.get_json())

    @patch('auth.jwt_required')
    def test_change_password_invalid_password(self, mock_jwt_required):
        mock_jwt_required.return_value = None
        with patch('auth.request', MockRequest({
            "email": "test@example.com",
            "newPassword": "short"
        })):
            response = self.auth.routes['/change-password']()
            self.assertEqual(response.status_code, 400)
            self.assertFalse(response.get_json()['success'])
            self.assertIn('error', response.get_json())

if __name__ == '__main__':
    unittest.main()