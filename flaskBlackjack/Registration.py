# This file defines the `init_registration_routes` function to handle user registration in a Flask application. 
# The `/registration` route supports both GET and POST methods.
# On a POST request, it checks for a username and password in the submitted form. 
# It then creates a new user object and an associated bank account, 
# sets the user's password, and adds the user to the database. Upon successful registration,
# it redirects the user to the login page. For a GET request, it simply renders the 
# registration form. 


import re
from flask import render_template, request, redirect, url_for, flash
from .model import db, User, BankAccount, Stats
from flask_login import current_user

def is_valid_email(email):
    """Check if the given string is a valid email address."""
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None

def init_registration_routes(app):
    @app.route('/registration', methods=['GET', 'POST'])
    def registration():
        if current_user.is_authenticated:
            message = 'You are already logged in.'
            flash(message)
            return redirect(url_for('profile'))
        
        if request.method == 'POST' and 'email' in request.form and 'password' in request.form:
            userEmail = request.form['email']
            password = request.form['password']

            # Check if username is a valid email address
            if not is_valid_email(userEmail):
                error_message = 'Please enter a valid email address.'
                flash(error_message)
                return render_template('registration.html')

            # Create a new user object
            new_user = User(email_address=userEmail)
            user_account = BankAccount()
            new_user.bank_account = user_account
            user_stats = Stats()
            new_user.stats = user_stats
            new_user.set_password(password)
            # Add the new user to the database
            db.session.add(new_user)
            db.session.commit()
            message = 'You have successfully registered!'
            flash(message)
            return redirect(url_for('login'))
            
        return render_template('registration.html')
