from flask import render_template, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user

def init_profile_route(app):
    @app.route('/profile', methods=['GET', 'POST'])
    @login_required
    def profile():
        if current_user.is_authenticated:
            return render_template('profile.html', user=current_user)