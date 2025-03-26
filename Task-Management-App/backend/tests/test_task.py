import unittest
from unittest.mock import patch, MagicMock
from bson import ObjectId
from datetime import datetime, timedelta
import json
from flask import Flask, jsonify, request

# Mock implementations of external dependencies
class MockTask:
    @staticmethod
    def create_task(task_data):
        return ObjectId()

    @staticmethod
    def find_tasks_by_user_id(user_id):
        return [
            {
                "_id": ObjectId(),
                "user": ObjectId(user_id),
                "title": "Test Task",
                "description": "Test Description",
                "status": "In Progress",
                "priority": "High",
                "deadline": datetime.utcnow() + timedelta(days=7),
                "date": datetime.utcnow()
            }
        ]

    @staticmethod
    def find_task_by_id(task_id):
        return {
            "_id": ObjectId(task_id),
            "user": ObjectId(),
            "title": "Test Task",
            "description": "Test Description",
            "status": "In Progress",
            "priority": "High",
            "deadline": datetime.utcnow() + timedelta(days=7),
            "date": datetime.utcnow()
        }

    @staticmethod
    def update_task(task_id, update_data):
        return True

    @staticmethod
    def delete_task(task_id):
        return True

    @staticmethod
    def to_json(task):
        return {
            "id": str(task["_id"]),
            "user": str(task["user"]),
            "title": task["title"],
            "description": task["description"],
            "status": task["status"],
            "priority": task["priority"],
            "deadline": task["deadline"].isoformat() if task["deadline"] else None,
            "date": task["date"].isoformat()
        }

def mock_verify_token(token):
    if token == "valid_token":
        return "valid_user_id"
    return None

# Utility functions
def create_app():
    app = Flask(__name__)
    return app

# Mock request context
class MockRequest:
    def __init__(self, headers=None, json=None):
        self.headers = headers or {}
        self.json = json or {}

# Test cases
class TestTaskController(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    @patch('flask.request', MockRequest(headers={'Authorization': 'valid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    @patch('models.task.Task', MockTask)
    def test_create_task_success(self):
        from controllers.task_controller import create_task

        with self.app.test_request_context(json={
            'title': 'Test Task',
            'description': 'Test Description',
            'status': 'In Progress',
            'priority': 'High',
            'deadline': '2023-06-01T00:00:00Z'
        }):
            response, status_code = create_task()
            self.assertEqual(status_code, 201)
            self.assertIn('Task added successfully', json.loads(response.get_data(as_text=True))['message'])

    @patch('flask.request', MockRequest(headers={}))
    def test_create_task_no_token(self):
        from controllers.task_controller import create_task

        response, status_code = create_task()
        self.assertEqual(status_code, 401)
        self.assertIn('No token provided', json.loads(response.get_data(as_text=True))['error'])

    @patch('flask.request', MockRequest(headers={'Authorization': 'invalid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    def test_create_task_invalid_token(self):
        from controllers.task_controller import create_task

        response, status_code = create_task()
        self.assertEqual(status_code, 401)
        self.assertIn('Invalid token', json.loads(response.get_data(as_text=True))['error'])

    @patch('flask.request', MockRequest(headers={'Authorization': 'valid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    @patch('models.task.Task', MockTask)
    def test_fetch_all_tasks_success(self):
        from controllers.task_controller import fetch_all_tasks

        response, status_code = fetch_all_tasks()
        self.assertEqual(status_code, 200)
        tasks = json.loads(response.get_data(as_text=True))
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['title'], 'Test Task')

    @patch('flask.request', MockRequest(headers={'Authorization': 'valid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    @patch('models.task.Task', MockTask)
    def test_update_task_success(self):
        from controllers.task_controller import update_task

        with self.app.test_request_context(json={
            'title': 'Updated Task',
            'status': 'Completed'
        }):
            response, status_code = update_task('valid_task_id')
            self.assertEqual(status_code, 200)
            self.assertIn('Task updated successfully', json.loads(response.get_data(as_text=True))['message'])

    @patch('flask.request', MockRequest(headers={'Authorization': 'valid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    @patch('models.task.Task', MockTask)
    def test_delete_task_success(self):
        from controllers.task_controller import delete_task

        response, status_code = delete_task('valid_task_id')
        self.assertEqual(status_code, 200)
        self.assertIn('Task has been deleted', json.loads(response.get_data(as_text=True))['message'])

    @patch('flask.request', MockRequest(headers={'Authorization': 'valid_token'}))
    @patch('utils.auth_utils.verify_token', mock_verify_token)
    @patch('models.task.Task.find_task_by_id', return_value=None)
    def test_delete_task_not_found(self, mock_find_task):
        from controllers.task_controller import delete_task

        response, status_code = delete_task('invalid_task_id')
        self.assertEqual(status_code, 404)
        self.assertIn('Task not found', json.loads(response.get_data(as_text=True))['error'])

if __name__ == '__main__':
    unittest.main()