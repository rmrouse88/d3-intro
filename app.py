from flask import Flask, render_template, jsonify
from static.data_getter import get_iris

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/data")
def data():
    return jsonify(get_iris())

if __name__ == "__main__":
    app.run(debug = True)


