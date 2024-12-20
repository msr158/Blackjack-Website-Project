from flask_login import login_user, logout_user, login_required, current_user
from flask import render_template, redirect, url_for, request, flash, send_file, jsonify
from .model import db, User, BankAccount
from .services import process_deposit, process_withdraw

def init_routes(app):
    @app.route('/')
    def root():
        return redirect(url_for('home'))


    @app.route('/home')
    def home():
        return render_template('home.html')


    @app.route('/contact')
    def contact():
        return render_template('contact.html')


    @app.route('/tutorial')
    def tutorial():
        return render_template('tutorial.html')


    @app.route('/blackjack')
    @login_required
    def blackjack():
        return render_template('blackjack.html')


    @app.route('/games')
    def games():
        return render_template('games.html')


    @app.route('/baccarat')
    @login_required
    def baccarat():
        return render_template('baccarat.html')
    
    @app.route('/baccarattutorial')
    def baccarattut():
        return render_template('baccarattutorial.html')
    
    @app.route('/blackjacktutorial')
    def blackjacktut():
        return render_template('blackjacktutorial.html')

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        flash('Goodbye.')
        return redirect(url_for('home'))

    @app.route('/get_card_image')
    def get_card_image():
        return send_file(app.static_folder, "img/cards/cards.avif", mimetype ='image/avif') 
    
    @app.route('/win', methods=['POST'])
    @login_required
    def win():
        data = request.get_json()
        amount = data.get('amount')
        if amount is None:
            return jsonify({'error': 'Amount not provided'}), 400
        try:
            current_user.bank_account.deposit(amount)
            db.session.commit()
            response = {
                'new_balance': current_user.bank_account.balance
            }
            return jsonify(response)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/lose', methods=['POST'])
    @login_required
    def lose():
        data = request.get_json()
        amount = data.get('amount')
        if amount is None:
            return jsonify({'error': 'Amount not provided'}), 400
        try:
            process_withdraw(current_user, amount)
            response = {
                'new_balance': current_user.bank_account.balance
            }
            return jsonify(response)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/deposit', methods = ['POST'])
    @login_required
    def deposit():
        if request.method == 'POST' and 'amount' in request.form:
            amount = request.form.get('amount')
        try:    
            process_deposit(current_user, amount)
            message = 'You have successfully deposited $' + amount + '!'
            flash(message)
            return redirect(url_for('profile'))
        except Exception as e:
            message = 'error' + str(e)
            flash(message)
            return redirect(url_for('profile'))
        
    @app.route('/win_count', methods = ['POST'])
    @login_required
    def win_count():
        try:
            current_user.stats.win_increase()
            db.session.commit()
            return jsonify({'message' : 'success'}),200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    @app.route('/lose_count', methods = ['POST'])
    @login_required
    def lose_count():
        try:
            current_user.stats.lose_increase()
            db.session.commit()
            return jsonify({'message' : 'success'}),200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/balance', methods = ['GET'])
    @login_required
    def balance():
        return jsonify(new_balance = current_user.bank_account.balance)
    
    @app.route('/update_username', methods = ['POST'])
    @login_required
    def update_username():
        if request.method == 'POST' and 'username' in request.form:
            current_user.username = request.form.get('username')
        db.session.commit()


    @app.route('/test')
    def test():
        return render_template('test.html')