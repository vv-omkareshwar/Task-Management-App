from flask import Flask
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URL from environment variable
mongo_url = os.getenv('MONGO_URL')

# Initialize PyMongo instance
mongo = PyMongo()

def init_db(app: Flask):
    """
    Initialize the database connection for the Flask app.
    
    :param app: Flask application instance
    """
    # Configure MongoDB
    app.config['MONGO_URI'] = mongo_url
    
    # Initialize PyMongo with the Flask app
    mongo.init_app(app)
    
    print("Successfully connected to MongoDB")

def get_db():
    """
    Get the database instance.
    
    :return: PyMongo database instance
    """
    return mongo.db