from .task import Task
from .user import User
from flask_mongoengine import MongoEngine

def init_db(app):
    db = MongoEngine()
    db.init_app(app)
    return db

__all__ = ['Task', 'User', 'init_db']