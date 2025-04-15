import os
from flask import Flask
from flask.testing import FlaskClient
from typing import Generator

# Set environment variable for testing
os.environ['FLASK_ENV'] = 'testing'

# Import the app
from backend.app import app

# Import database setup (assuming we have this function)
from backend.config import setup_test_db

def get_test_client() -> FlaskClient:
    """Get a test client for the Flask app."""
    return app.test_client()

# Utility function for authentication in tests
def authenticate_test_user(client: FlaskClient, email: str, password: str) -> dict:
    """Authenticate a test user and return the response data."""
    response = client.post('/auth/login', json={
        'email': email,
        'password': password
    })
    return response.get_json()

# Fixture for pytest (remove if not using pytest)
import pytest

@pytest.fixture(scope='module')
def test_client() -> Generator[FlaskClient, None, None]:
    with app.test_client() as testing_client:
        with app.app_context():
            setup_test_db()  # Setup test database
            yield testing_client

# Import test cases to make them discoverable
from .test_auth import *
from .test_tasks import *