from flask import Flask
import logging
from .auth import auth_bp
from .task import task_bp
from ..utils import auth_utils  # Importing utilities

def register_routes(app: Flask):
    logging.info('Registering routes...')
    app.register_blueprint(auth_bp)
    app.register_blueprint(task_bp)
    logging.info('Routes registered successfully.')