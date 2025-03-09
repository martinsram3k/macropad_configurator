from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Povolení CORS pro všechny zdroje

@app.route('/receivedata', methods=['POST'])
def receive_data():
    data = request.get_json()
    print(f"Přijatá data (celá): {data}")  # Přidáno logování celých dat
    if data:
        button = data.get('button')
        layer = data.get('layer')
        function = data.get('function')

        print(f"Button={button}, Layer={layer}, Function={function}")
        return jsonify({'message': 'Data byla úspěšně přijata.'}), 200
    else:
        return jsonify({'error': 'Žádná data nebyla přijata.'}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)