from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api
from controllers.tasks import get_user_tasks, create_new_task, update_existing_task, delete_existing_task
from utils.helpers import require_auth

tasks = Blueprint('tasks', __name__)
api = Api(tasks)

class TaskRoutes(Resource):
    @require_auth
    def get(self):
        try:
            tasks = get_user_tasks(request.user.id)
            return jsonify(tasks)
        except Exception as e:
            return {'error': str(e)}, 500

    @require_auth
    def post(self):
        try:
            task_data = request.json
            new_task = create_new_task(request.user.id, task_data)
            return jsonify(new_task), 201
        except Exception as e:
            return {'error': str(e)}, 500

class TaskDetailRoutes(Resource):
    @require_auth
    def put(self, task_id):
        try:
            task_data = request.json
            updated_task = update_existing_task(task_id, task_data)
            if updated_task:
                return jsonify(updated_task)
            return {'error': 'Task not found'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

    @require_auth
    def delete(self, task_id):
        try:
            result = delete_existing_task(task_id)
            if result:
                return {'success': 'Task has been deleted'}
            return {'error': 'Task not found'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(TaskRoutes, '/tasks')
api.add_resource(TaskDetailRoutes, '/tasks/<int:task_id>')