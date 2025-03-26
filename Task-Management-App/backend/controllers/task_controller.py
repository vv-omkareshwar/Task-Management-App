from flask import jsonify, request
from models.task import Task
from utils.auth_utils import verify_token
from bson import ObjectId
from flask_swagger_ui import swagger_ui_blueprint
from flasgger import Swagger, swag_from

def create_task():
    """
    Create a new task
    ---
    tags:
      - Tasks
    parameters:
      - in: header
        name: Authorization
        required: true
        schema:
          type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
            status:
              type: string
            priority:
              type: string
            deadline:
              type: string
              format: date-time
    responses:
      201:
        description: Task created successfully
      400:
        description: Bad request
      401:
        description: Unauthorized
      500:
        description: Internal server error
    """
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        data = request.json
        required_fields = ['title', 'status']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Title and status are required"}), 400

        task_data = {
            'user': ObjectId(user_id),
            'title': data['title'],
            'description': data.get('description', ''),
            'status': data['status'],
            'priority': data.get('priority', ''),
            'deadline': data.get('deadline'),
            'date': datetime.utcnow()
        }

        task_id = Task.create_task(task_data)
        return jsonify({"message": "Task added successfully", "taskId": str(task_id)}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_all_tasks():
    """
    Fetch all tasks for a user
    ---
    tags:
      - Tasks
    parameters:
      - in: header
        name: Authorization
        required: true
        schema:
          type: string
    responses:
      200:
        description: List of tasks
      401:
        description: Unauthorized
      500:
        description: Internal server error
    """
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        tasks = Task.find_tasks_by_user_id(user_id)
        return jsonify([Task.to_json(task) for task in tasks]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_task(task_id):
    """
    Update a task
    ---
    tags:
      - Tasks
    parameters:
      - in: header
        name: Authorization
        required: true
        schema:
          type: string
      - in: path
        name: task_id
        required: true
        schema:
          type: string
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
            status:
              type: string
            priority:
              type: string
            deadline:
              type: string
              format: date-time
    responses:
      200:
        description: Task updated successfully
      400:
        description: Bad request
      401:
        description: Unauthorized
      404:
        description: Task not found
      500:
        description: Internal server error
    """
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        data = request.json
        update_data = {}
        for field in ['title', 'description', 'status', 'priority', 'deadline']:
            if field in data:
                update_data[field] = data[field]

        task = Task.find_task_by_id(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404

        if str(task['user']) != user_id:
            return jsonify({"error": "Not authorized to update this task"}), 401

        updated = Task.update_task(task_id, update_data)
        if updated:
            return jsonify({"message": "Task updated successfully"}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_task(task_id):
    """
    Delete a task
    ---
    tags:
      - Tasks
    parameters:
      - in: header
        name: Authorization
        required: true
        schema:
          type: string
      - in: path
        name: task_id
        required: true
        schema:
          type: string
    responses:
      200:
        description: Task deleted successfully
      401:
        description: Unauthorized
      404:
        description: Task not found
      500:
        description: Internal server error
    """
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        user_id = verify_token(token)
        if not user_id:
            return jsonify({"error": "Invalid token"}), 401

        task = Task.find_task_by_id(task_id)
        if not task:
            return jsonify({"error": "Task not found"}), 404

        if str(task['user']) != user_id:
            return jsonify({"error": "Not authorized to delete this task"}), 401

        deleted = Task.delete_task(task_id)
        if deleted:
            return jsonify({"message": "Task has been deleted"}), 200
        else:
            return jsonify({"error": "Failed to delete task"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500