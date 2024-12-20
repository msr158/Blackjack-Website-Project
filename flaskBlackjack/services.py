from .model import db, User

def process_deposit(user,amount):
    deposit_amount = float(amount)
    user.bank_account.deposit(deposit_amount)
    db.session.commit()
    
def process_withdraw(user,amount):
    withdraw_amount = float(amount)
    user.bank_account.withdraw(withdraw_amount)
    db.session.commit()
