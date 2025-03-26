import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/task_management'

    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = os.environ.get('TEST_MONGO_URI') or 'mongodb://localhost:27017/test_task_management'

class ProductionConfig(Config):
    pass

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_db():
    client = MongoClient(Config.MONGO_URI)
    return client.get_database()

def close_db(e=None):
    db = get_db()
    if db is not None:
        db.client.close()

def init_db():
    db = get_db()
    # You can add any initial setup here if needed
    print("Database initialized")

def get_config(config_name):
    return config.get(config_name, config['default'])