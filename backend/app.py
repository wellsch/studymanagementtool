from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/notes', methods=['GET', 'POST'])
def notes():
    pass

@app.route('/study', methods=['GET', 'POST'])
def study():
    pass

@app.route('/calendar', methods=['GET', 'POST'])
def calendar():
    pass

if __name__ == '__main__':
    app.run(debug=True)