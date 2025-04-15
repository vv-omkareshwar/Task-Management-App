from flask import Blueprint, request, jsonify
from flask_restful import Resource, Api
from marshmallow import Schema, fields, validate
from models.task import Task
from utils.helpers import require_auth

tasks = Blueprint('tasks', __name__)
api = Api(tasks)

class TaskSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    status = fields.Str(validate=validate.OneOf(['To-Do', 'In Progress', 'Under Review', 'Finished']))
    priority = fields.Str()
    deadline = fields.DateTime()

task_schema = TaskSchema()

class TaskResource(Resource):
    @require_auth
    def get(self):
        try:
            tasks = Task.objects(user=request.user.id)
            return jsonify([task.to_dict() for task in tasks])
        except Exception as e:
            return {'error': str(e)}, 500

    @require_auth
    def post(self):
        errors = task_schema.validate(request.json)
        if errors:
            return {'errors': errors}, 400

        try:
            task_data = request.json
            task_data['user'] = request.user.id
            task = Task(**task_data)
            task.save()
            return task.to_dict(), 201
        except Exception as e:
            return {'error': str(e)}, 500

class TaskDetailResource(Resource):
    @require_auth
    def put(self, task_id):
        errors = task_schema.validate(request.json, partial=True)
        if errors:
            return {'errors': errors}, 400

        try:
            task = Task.objects.get(id=task_id, user=request.user.id)
            for key, value in request.json.items():
                setattr(task, key, value)
            task.save()
            return task.to_dict()
        except Task.DoesNotExist:
            return {'error': 'Task not found'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

    @require_auth
    def delete(self, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user.id)
            task.delete()
            return {'success': 'Task has been deleted'}
        except Task.DoesNotExist:
            return {'error': 'Task not found'}, 404
        except Exception as e:
            return {'error': str(e)}, 500

api.add_resource(TaskResource, '/tasks')
api.add_resource(TaskDetailResource, '/tasks/<string:task_id>')