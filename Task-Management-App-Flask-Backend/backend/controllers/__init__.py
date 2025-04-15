# Import necessary modules
from flask import Blueprint

# Import controllers with error handling
try:
    from .auth import auth_routes
    from .tasks import tasks_routes
except ImportError as e:
    print(f"Error importing controllers: {e}")
    # In a real application, we might want to log this error properly
    # and possibly re-raise the exception or handle it more gracefully

# Export the route blueprints for use in the main application
__all__ = ['auth_routes', 'tasks_routes']