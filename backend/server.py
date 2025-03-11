from flask import Flask, request, jsonify
from flask_cors import CORS
import serial

app = Flask(__name__)
CORS(app)

# Globální proměnná pro sériový port
ser = None

def init_serial():
    global ser
    try:
        ser = serial.Serial('COM6', 115200)  # Nahraďte 'COM3' správným portem
        print("Sériový port inicializován")
    except serial.SerialException as e:
        print(f"Chyba při inicializaci sériového portu: {e}")

@app.route('/receivedata', methods=['POST'])