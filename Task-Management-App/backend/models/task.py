from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from config.config import get_config

# Get the configuration
config = get_config('development')  # You can change this based on your environment

# Initialize MongoDB client
client = MongoClient(config.MONGO_URI)
db = client[config.DATABASE_NAME]
tasks_collection = db['tasks']

class Task:
    def __init__(self, user_id, title, description=None, status='To-Do', priority=None, deadline=None):
        self.user_id = ObjectId(user_id)
        self.title = title
        self.description = description
        self.status = status
        self.priority = priority
        self.deadline = deadline
        self.date = datetime.utcnow()

    @staticmethod
    def create_task(task_data):
        task = Task(
            user_id=task_data['user_id'],
            title=task_data['title'],
            description=task_data.get('description'),
            status=task_data.get('status', 'To-Do'),
            priority=task_data.get('priority'),
            deadline=task_data.get('deadline')
        )
        result = tasks_collection.insert_one(task.__dict__)
        return str(result.inserted_id)

    @staticmethod
    def find_tasks_by_user_id(user_id):
        return list(tasks_collection.find({'user_id': ObjectId(user_id)}))

    @staticmethod
    def find_task_by_id(task_id):
        return tasks_collection.find_one({'_id': ObjectId(task_id)})

    @staticmethod
    def update_task(task_id, update_data):
        result = tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def delete_task(task_id):
        result = tasks_collection.delete_one({'_id': ObjectId(task_id)})
        return result.deleted_count > 0

    @staticmethod
    def to_json(task):
        return {
            'id': str(task['_id']),
            'user_id': str(task['user_id']),
            'title': task['title'],
            'description': task.get('description'),
            'status': task['status'],
            'priority': task.get('priority'),
            'deadline': task.get('deadline'),
            'date': task['date'].isoformat() if isinstance(task['date'], datetime) else task['date']
        }