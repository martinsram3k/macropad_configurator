from flask import Flask, request, jsonify
from flask_cors import CORS
import serial
import logging

app = Flask(__name__)
CORS(app)

# Konfigurace logování
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

ser = None

def init_serial():
    global ser
    try:
        ser = serial.Serial('COM6', 115200)
        logging.info("Sériový port inicializován")
    except serial.SerialException as e:
        logging.error(f"Chyba při inicializaci sériového portu: {e}")

init_serial()

@app.route('/receivedata', methods=['POST'])
def receivedata():
    global ser
    try:
        data = request.get_json()
        logging.info(f"{data}")  # Logování přijatých dat

        if ser:
            ser.write(str(data).encode())
            return jsonify({"status": "success", "message": "Data received and sent to serial port"})
        else:
            logging.warning("Sériový port není inicializován, data nebyla odeslána.") #Logovani varovani o neodeslani dat.
            return jsonify({"status": "warning", "message": "Serial port not initialized, data not sent."}), 500
    except Exception as e:
        logging.error(f"Chyba při zpracování dat: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)