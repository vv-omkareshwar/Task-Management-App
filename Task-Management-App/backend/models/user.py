from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
from flask import current_app

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.date = datetime.utcnow()

    @staticmethod
    def get_db():
        client = MongoClient(current_app.config['MONGO_URI'])
        return client[current_app.config['DB_NAME']]

    @classmethod
    def create_user(cls, user_data):
        db = cls.get_db()
        user_collection = db.users
        result = user_collection.insert_one(user_data)
        return str(result.inserted_id)

    @classmethod
    def find_user_by_email(cls, email):
        db = cls.get_db()
        user_collection = db.users
        return user_collection.find_one({"email": email})

    @classmethod
    def find_user_by_id(cls, user_id):
        db = cls.get_db()
        user_collection = db.users
        return user_collection.find_one({"_id": ObjectId(user_id)})

    @classmethod
    def update_user(cls, user_id, update_data):
        db = cls.get_db()
        user_collection = db.users
        result = user_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0