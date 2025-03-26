from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.task_controller import create_task, get_user_tasks, update_task, delete_task
from flasgger import swag_from

task_bp = Blueprint('task', __name__)

@task_bp.route('/', methods=['GET'])
@jwt_required()
@swag_from({
    'tags': ['Tasks'],
    'description': 'Get all tasks for the authenticated user',
    'responses': {
        200: {
            'description': 'List of tasks',
            'schema': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'id': {'type': 'string'},
                        'title': {'type': 'string'},
                        'description': {'type': 'string'},
                        'status': {'type': 'string'},
                        'priority': {'type': 'string'},
                        'deadline': {'type': 'string', 'format': 'date-time'}
                    }
                }
            }
        },
        401: {
            'description': 'Unauthorized'
        },
        500: {
            'description': 'Internal server error'
        }
    }
})
def fetch_all_tasks():
    try:
        user_id = get_jwt_identity()
        tasks = get_user_tasks(user_id)
        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@task_bp.route('/', methods=['POST'])
@jwt_required()
@swag_from({
    'tags': ['Tasks'],
    'description': 'Create a new task',
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string'},
                    'description': {'type': 'string'},
                    'status': {'type': 'string'},
                    'priority': {'type': 'string'},
                    'deadline': {'type': 'string', 'format': 'date-time'}
                },
                'required': ['title', 'status']
            }
        }
    ],
    'responses': {
        201: {
            'description': 'Task created successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'string'},
                    'title': {'type': 'string'},
                    'description': {'type': 'string'},
                    'status': {'type': 'string'},
                    'priority': {'type': 'string'},
                    'deadline': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {
            'description': 'Bad request'
        },
        401: {
            'description': 'Unauthorized'
        },
        500: {
            'description': 'Internal server error'
        }
    }
})
def add_task():
    try:
        user_id = get_jwt_identity()
        task_data = request.json
        if not task_data or 'title' not in task_data or 'status' not in task_data:
            return jsonify({"error": "Title and status are required"}), 400
        new_task = create_task(user_id, task_data)
        return jsonify(new_task), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@task_bp.route('/<task_id>', methods=['PUT'])
@jwt_required()
@swag_from({
    'tags': ['Tasks'],
    'description': 'Update an existing task',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True
        },
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'type': 'object',
                'properties': {
                    'title': {'type': 'string'},
                    'description': {'type': 'string'},
                    'status': {'type': 'string'},
                    'priority': {'type': 'string'},
                    'deadline': {'type': 'string', 'format': 'date-time'}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Task updated successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'id': {'type': 'string'},
                    'title': {'type': 'string'},
                    'description': {'type': 'string'},
                    'status': {'type': 'string'},
                    'priority': {'type': 'string'},
                    'deadline': {'type': 'string', 'format': 'date-time'}
                }
            }
        },
        400: {
            'description': 'Bad request'
        },
        401: {
            'description': 'Unauthorized'
        },
        404: {
            'description': 'Task not found'
        },
        500: {
            'description': 'Internal server error'
        }
    }
})
def update_task_route(task_id):
    try:
        user_id = get_jwt_identity()
        task_data = request.json
        updated_task = update_task(user_id, task_id, task_data)
        if updated_task:
            return jsonify(updated_task), 200
        else:
            return jsonify({"error": "Task not found or you're not authorized to update it"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@task_bp.route('/<task_id>', methods=['DELETE'])
@jwt_required()
@swag_from({
    'tags': ['Tasks'],
    'description': 'Delete a task',
    'parameters': [
        {
            'name': 'task_id',
            'in': 'path',
            'type': 'string',
            'required': True
        }
    ],
    'responses': {
        200: {
            'description': 'Task deleted successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {'type': 'string'}
                }
            }
        },
        401: {
            'description': 'Unauthorized'
        },
        404: {
            'description': 'Task not found'
        },
        500: {
            'description': 'Internal server error'
        }
    }
})
def delete_task_route(task_id):
    try:
        user_id = get_jwt_identity()
        result = delete_task(user_id, task_id)
        if result:
            return jsonify({"message": "Task has been deleted"}), 200
        else:
            return jsonify({"error": "Task not found or you're not authorized to delete it"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500