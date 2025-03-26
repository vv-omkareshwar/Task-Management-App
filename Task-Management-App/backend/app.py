from flask import Flask
from flask_cors import CORS
from config.config import get_config
from routes.auth import auth_bp
from routes.task import task_bp
from flasgger import Swagger

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))

    # Initialize CORS
    CORS(app)

    # Initialize Swagger
    Swagger(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(task_bp, url_prefix='/api/task')

    @app.route('/')
    def hello():
        return 'Hello, World!'

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)