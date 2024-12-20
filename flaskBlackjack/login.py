# This file includes the `init_login_route` function for the Flask application, which handles login functionality. 
# It sets up a route for both GET and POST requests at `/login`. 
# On a POST request, it checks for username and password in the form data, authenticates against the database,
# and logs the user in if credentials are valid. 
# Success or failure messages are flashed accordingly. 
# If authentication is successful, the user is redirected to the home page; 
# otherwise, they are prompted to try logging in again on the login page.

from flask import render_template,request,redirect,url_for,flash
from .model import db, User, BankAccount, Stats
from flask_login import login_user, current_user

def init_login_route(app):
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if not current_user.is_authenticated:
            if request.method == 'POST' and 'email' in request.form and 'loginPassword' in request.form:
                userEmailInput = request.form['email']
                password = request.form['loginPassword']
                user = User.query.filter_by(email_address = userEmailInput).first()
                if user and user.validate_password(password):
                    login_user(user)
                    if current_user.is_authenticated:
                        return redirect(url_for('profile'))
                else:
                    message = 'Invalid username or password. Please try again.'
                    flash(message)
                    return render_template('login.html')
            elif app.config['ENV'] == 'development':
                if User.query.filter_by(id = 0).first() is None:
                    dev_user = User(username='dev', email_address = 'dev@example.com', bank_account=BankAccount(balance=1000),
                                    stats=Stats(),id =0)
                    db.session.add(dev_user)
                    db.session.commit()
        
                dev_user = User.query.filter_by(id = 0).first()
                login_user(dev_user)
                message = (
                    f'You have successfully logged in as {current_user.username} '
                    f'with current balance: {current_user.bank_account.balance}')
                flash(message)
                return redirect(url_for('profile'))
                
            return render_template('login.html')
        
        message = 'You are already logged in.'
        flash(message)
        return redirect(url_for('profile'))