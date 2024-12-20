from flaskBlackjack import create_app


def test_config():
    assert not create_app().testing
    assert create_app({'TESTING': True}).testing
    assert 1 == 2


def test_hello(client):
    response = client.get('/')
    assert response.status_code == 200