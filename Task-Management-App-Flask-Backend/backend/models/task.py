from flask_mongoengine import MongoEngine
from datetime import datetime

db = MongoEngine()

class Task(db.Document):
    user = db.ReferenceField('User', required=True)
    title = db.StringField(required=True)
    description = db.StringField()
    status = db.StringField(choices=['To-Do', 'In Progress', 'Under Review', 'Finished'], default='To-Do')
    priority = db.StringField()
    deadline = db.DateTimeField()
    date = db.DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'tasks',
        'indexes': [
            'user',
            'status',
            'priority',
            'deadline',
            'date'
        ]
    }

    def to_dict(self):
        return {
            'id': str(self.id),
            'user': str(self.user.id),
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'date': self.date.isoformat()
        }