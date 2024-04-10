from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    # Extract the ID from the request data
    id_int = request.form.get('id')
    if id_int:
        print(f"Received ID: {id_int}")
        return jsonify({"status": "success", "message": "ID received"}), 200
    else:
        return jsonify({"status": "error", "message": "No ID provided"}), 400

if __name__ == '__main__':
    # Run the Flask application on 127.0.0.3000
    app.run(host='127.0.0.1', port=3000)
