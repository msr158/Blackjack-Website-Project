from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

db = SQLAlchemy()

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String(128),unique=True)
    username= db.Column(db.String(128),nullable=True)
    password_encrypt = db.Column(db.String(256))
    
    def set_password(self, password):
        self.password_encrypt = generate_password_hash(password)

    def validate_password(self, password):
        return check_password_hash(self.password_encrypt, password)

class BankAccount(db.Model):
    account_number = db.Column(db.String(120), unique=True, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    balance = db.Column(db.Float, nullable=False,default=730.0)
    user = db.relationship('User', backref=db.backref('bank_account', uselist=False, lazy=True))
    
    def deposit(self, amount):
        if amount > 0:
            self.balance += amount
            return self.balance
        else:
            raise ValueError("amount must be greater than 0")

    def withdraw(self, amount):
        if amount > 0 and self.balance >= amount:
            self.balance -= amount
            return self.balance
        elif amount <= 0:
            raise ValueError("amount must be greater than 0")
        else:
            raise ValueError("insufficient balance")
        
class Stats(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    win = db.Column(db.Integer, nullable=False,default=0)
    lose = db.Column(db.Integer, nullable=False,default=0)
    total = db.Column(db.Integer, nullable=False,default=0)
    user = db.relationship('User', backref=db.backref('stats', uselist=False, lazy=True))
    
    def win_increase(self):
        self.win += 1
        self.total += 1
        return self.win
    
    def lose_increase(self):
        self.lose += 1
        self.total += 1
        return self.lose
