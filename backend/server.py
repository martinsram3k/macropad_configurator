from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/receivedata', methods=['POST'])
def receive_data():
    data = request.get_json()
    if data:
        button = data.get('button')
        layer = data.get('layer')
        function = data.get('function')

        print(f"Tlačítko: {button}, Vrstva: {layer}, Funkce: {function}")
        return jsonify({'message': 'Data byla úspěšně přijata.'}), 200
    else:
        return jsonify({'error': 'Žádná data nebyla přijata.'}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)