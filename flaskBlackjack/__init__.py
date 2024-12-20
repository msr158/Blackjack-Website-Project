"""
Application Initialization Module

!!!!!!!no matter what routes you defined that is not in routes.py, you need to import it here!!!!!!!!
!!!!!!!check out the Registration.py file for example,pass the app as an argument!!!!!!!!
!!!!!!!Do not import app!!!!!!!

This module initializes the Flask application and its extensions, sets up the application configurations,
and performs initial application setup tasks such as database initialization.

Features:
- Create and configure the Flask app instance.
- Initialize Flask extensions like SQLAlchemy for database operations.
- Set up application-level configurations and secret keys.
- Optionally, initialize the application database and create required tables.
- Register error handlers and other application-wide settings. Such as before_request, after_request, login
manager etc.
Usage:
The module is executed at the start of the application and is responsible for creating the app instance 
that will be used throughout the application lifecycle.

Note:
This module should be kept updated with any changes in application structure, extensions, or configuration.

Author: Xiaoming Wang
"""
import os
from dotenv import load_dotenv
from flask import Flask, flash, redirect, url_for
from flask_login import LoginManager

def create_app(test_config=None):
    # create and configure the app
    load_dotenv()
    app = Flask(__name__, instance_relative_config=True)
    # database_url = os.getenv('DATABASE_URL','sqlite:///blackjack.db'),
    # if database_url.startswith('postgres://'):
    #     database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY'),
        ENV=os.getenv('FLASK_ENV', 'production'),
        # SQLALCHEMY_DATABASE_URI=database_url,
        # SQLALCHEMY_TRACK_MODIFICATIONS=False
    )
    
    if test_config is not None:
        app.config.from_mapping(test_config)
     #configure the database
    database_url = os.getenv("DATABASE_URL", "sqlite:///blackjack.db")

    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    #initialize the database
    from .model import db
    db.init_app(app)
    with app.app_context():
        db.create_all()
    
    #initialize the login manager
    login_manager = LoginManager(app)
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    
    #user loader function
    from .model import User
    @login_manager.user_loader
    def load_user(user_id):
        if user_id is None:
            return None
        try:
            return User.query.get(int(user_id))
        except ValueError:
            return None
    
    #initialize the routes
    from .routes import init_routes
    routes.init_routes(app)
    
    #initialize the registration routes
    from .Registration import init_registration_routes
    init_registration_routes(app)
    
    #initialize the login routes
    from .login import init_login_route
    init_login_route(app)
    
    
    #initialize the profile routes
    from .userprofile import init_profile_route
    init_profile_route(app)
    
    #
    
    
    #error handlers for 404
    @app.errorhandler(404)
    def not_found(error):
        flash('Page not found. Now sending you back to the home page.')
        return redirect(url_for('home'))
    #save space for other error handlers and other extension configurations
    return app