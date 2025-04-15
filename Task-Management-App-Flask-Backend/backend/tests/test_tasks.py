import unittest
from unittest.mock import patch, MagicMock
from flask import Flask, json
from werkzeug.exceptions import BadRequest
from bson import ObjectId
from datetime import datetime, timedelta

# Mock implementations
class MockUser:
    def __init__(self, id):
        self.id = id

class MockTask:
    def __init__(self, **kwargs):
        self.id = kwargs.get('id', str(ObjectId()))
        self.title = kwargs.get('title')
        self.description = kwargs.get('description')
        self.status = kwargs.get('status')
        self.priority = kwargs.get('priority')
        self.deadline = kwargs.get('deadline')
        self.user = kwargs.get('user')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'user': str(self.user)
        }

    @classmethod
    def objects(cls, **kwargs):
        return MockTaskQuerySet(**kwargs)

    def save(self):
        pass

    def delete(self):
        pass

class MockTaskQuerySet:
    def __init__(self, **kwargs):
        self.filters = kwargs

    def get(self, **kwargs):
        if 'id' in kwargs and 'user' in kwargs:
            if kwargs['id'] == 'non_existent_id':
                raise MockTask.DoesNotExist()
            return MockTask(id=kwargs['id'], user=kwargs['user'])
        raise MockTask.DoesNotExist()

class MockTask:
    DoesNotExist = Exception

def require_auth(f):
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated

# Import the code to be tested
from backend.controllers.tasks import tasks, TaskResource, TaskDetailResource

# Create a Flask app for testing
app = Flask(__name__)
app.register_blueprint(tasks)

class TestTaskResource(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = MockUser(id='test_user_id')

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_get_tasks_success(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_tasks = [
            MockTask(title='Task 1', user=self.user.id),
            MockTask(title='Task 2', user=self.user.id)
        ]
        mock_task.objects.return_value = mock_tasks

        response = self.client.get('/tasks')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['title'], 'Task 1')
        self.assertEqual(data[1]['title'], 'Task 2')

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_get_tasks_error(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_task.objects.side_effect = Exception('Database error')

        response = self.client.get('/tasks')
        self.assertEqual(response.status_code, 500)
        data = json.loads(response.data)
        self.assertIn('error', data)

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_post_task_success(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_request.json = {
            'title': 'New Task',
            'description': 'Task description',
            'status': 'To-Do',
            'priority': 'High',
            'deadline': (datetime.now() + timedelta(days=1)).isoformat()
        }

        response = self.client.post('/tasks', json=mock_request.json)
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'New Task')
        self.assertEqual(data['user'], str(self.user.id))

    @patch('backend.controllers.tasks.request')
    def test_post_task_invalid_input(self, mock_request):
        mock_request.user = self.user
        mock_request.json = {
            'description': 'Task without title'
        }

        response = self.client.post('/tasks', json=mock_request.json)
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('errors', data)

class TestTaskDetailResource(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.user = MockUser(id='test_user_id')

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_put_task_success(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_request.json = {
            'title': 'Updated Task',
            'status': 'In Progress'
        }
        mock_task.objects.get.return_value = MockTask(id='existing_task_id', user=self.user.id)

        response = self.client.put('/tasks/existing_task_id', json=mock_request.json)
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['title'], 'Updated Task')
        self.assertEqual(data['status'], 'In Progress')

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_put_task_not_found(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_request.json = {
            'title': 'Updated Task'
        }
        mock_task.objects.get.side_effect = MockTask.DoesNotExist()

        response = self.client.put('/tasks/non_existent_id', json=mock_request.json)
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_delete_task_success(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_task.objects.get.return_value = MockTask(id='existing_task_id', user=self.user.id)

        response = self.client.delete('/tasks/existing_task_id')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('success', data)

    @patch('backend.controllers.tasks.request')
    @patch('backend.controllers.tasks.Task')
    def test_delete_task_not_found(self, mock_task, mock_request):
        mock_request.user = self.user
        mock_task.objects.get.side_effect = MockTask.DoesNotExist()

        response = self.client.delete('/tasks/non_existent_id')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertIn('error', data)

if __name__ == '__main__':
    unittest.main()