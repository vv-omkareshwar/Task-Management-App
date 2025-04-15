"""
This module initializes the routes package and makes the authentication and tasks Blueprints
available for import. These Blueprints define the API endpoints for user authentication
and task management respectively.
"""

# Import Blueprints from auth and tasks modules
from .auth import auth_bp
from .tasks import tasks_bp

# Make Blueprints available for import from the routes package
__all__ = ['auth_bp', 'tasks_bp']