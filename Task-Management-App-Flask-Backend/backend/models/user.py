from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

class User(db.Document):
    name = db.StringField(required=True)
    email = db.EmailField(required=True, unique=True)
    password = db.StringField(required=True)
    date = db.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'users',
        'indexes': [
            {'fields': ['email'], 'unique': True}
        ]
    }

    def __repr__(self):
        return f"<User {self.email}>"

    @classmethod
    def get_by_email(cls, email):
        return cls.objects(email=email).first()

    @classmethod
    def create_user(cls, name, email, password):
        user = cls(name=name, email=email, password=password)
        user.save()
        return user