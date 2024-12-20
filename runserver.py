#this is for development only use gunicorn for production
from flaskBlackjack import create_app

app = create_app()

app.run(debug=True)
