from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import logging
import time
import threading
import signal
import sys
import random  # Import modulu pro generování náhodných čísel

app = Flask(__name__)
server_port = 5000
CORS(app)

# Konfigurace logování
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Proměnná pro uchování aktuálního stavu serveru
server_status = "loading" # Nastavíme počáteční stav na loading
_shutting_down = False # Flag pro kontrolu, zda probíhá vypínání
# target_ip = "localhost"  # Již nepotřebujeme, protože negenerujeme skutečný ping

def get_ping():
    """Funkce pro generování náhodného pingu v ms."""
    return random.randint(10, 60) # Generuje náhodné celé číslo mezi 10 a 100

def update_status():
    """Funkce pro simulaci změny stavu serveru (loading -> online -> offline)."""
    global server_status
    # Nastavení na loading při startu
    server_status = "loading"
    logging.info("Server is loading...")
    time.sleep(5)
    server_status = "online"
    logging.info("Server is online")
    # Nyní se stav nebude automaticky měnit

def signal_handler(sig, frame):
    """Handler pro zachycení signálu přerušení (Ctrl+C)."""
    global server_status, _shutting_down
    if not _shutting_down:
        _shutting_down = True
        logging.info("Přerušení serveru (Ctrl+C). Nastavuji stav na loading před vypnutím...")
        server_status = "loading"
        time.sleep(3) # Zůstane v loading po dobu 3 sekund
        logging.info("Server is offline")
        server_status = "offline"
        time.sleep(1) # Malá pauza pro jistotu
        sys.exit(0)

@app.route('/')
def index():
    """Zobrazí hlavní stránku (index.html)."""
    return render_template('index.html')

@app.route('/status')
def get_status():
    """Endpoint pro získání aktuálního stavu serveru."""
    global server_status
    ping_value = get_ping()
    status = server_status  # Použijeme aktuální server_status

    return jsonify({
        'status': status,
        'ping': ping_value,
        'port': server_port
    })

@app.route('/receivedata', methods=['POST'])
def receivedata():
    """Endpoint pro příjem dat z frontendu (zatím zakomentováno)."""
    try:
        data = request.get_json()
        logging.info(f"Přijatá data: {data}")
        logging.info("Sériový port je zakomentován, data nebudou odeslána.")
        return jsonify({"status": "info", "message": "Serial port functionality is currently disabled."})
    except Exception as e:
        logging.error(f"Chyba při zpracování dat: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

status_thread = threading.Thread(target=update_status, daemon=True)

if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    status_thread.start()
    app.run(debug=False, port=5000)