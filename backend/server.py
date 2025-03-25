from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import threading
import signal
import sys

server_shutting_down = False

app = Flask(__name__)
CORS(app)

# Konfigurace logování
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

logging.info("Flask server is online and ready to accept requests.")

@app.route('/status')
def get_status():
    """Vrací stav serveru."""
    if server_shutting_down:
        return jsonify({'status': 'shutting_down'})
    return jsonify({'status': 'online'})

def shutdown_server():
    global server_shutting_down
    logging.info("Server se vypíná...")
    server_shutting_down = True
    time.sleep(2)
    logging.info("Server byl vypnut.")
    sys.exit(0)

def signal_handler(signum, frame):
    logging.warning(f"Přijat signál pro ukončení ({signum}), spouštím vypínání...")
    shutdown_server()


# Zakomentování sekce pro práci se sériovým portem
# ser = None
# serial_port = 'COM6' # Název sériového portu
# baud_rate = 115200 # Rychlost komunikace
# serial_thread = None # Proměnná pro uložení vlákna

# def init_serial():
#   global ser
#   retry_count = 0 # Počítadlo opakování
#   while ser is None: # Opakuj, dokud se nepodaří připojit
#     try:
#       ser = serial.Serial(serial_port, baud_rate)
#       logging.info(f"Sériový port {serial_port} inicializován")
#       if ser.is_open:
#         logging.info(f"Sériový port {serial_port} je otevřen") # Logovani otevreni portu
#       start_serial_listener() # Spuštění naslouchání dat ze sériového portu
#       logging.info(f"Sériový port {serial_port} úspěšně otevřen po {retry_count} pokusech.")
#     except serial.SerialException as e:
#       logging.error(f"Chyba při inicializaci sériového portu {serial_port}: {e}")
#       logging.info("Pokus o opakované připojení za 10 sekund...")
#       time.sleep(10) # Počkej 10 sekund před dalším pokusem
#       retry_count += 1
#       if retry_count > 10: # Pokud se port nepodaří otevřít po 10 pokusech, ukončíme aplikaci.
#         logging.error(f"Sériový port {serial_port} se nepodařilo otevřít ani po 10 pokusech. Ukončuji aplikaci.")
#         exit(1)

# def start_serial_listener():
#   global serial_thread
#   def listen():
#     logging.debug("Vlákno pro naslouchání sériového portu spuštěno") # Logovani spusteni vlakna
#     while ser and ser.is_open:
#       try:
#         line = ser.readline().decode('utf-8').strip()
#         if line:
#           logging.debug(f"Data ze sériového portu (před logováním): {line}") # Logovani dat pred logovanim
#           logging.info(f"Data ze sériového portu: {line}")
#       except UnicodeDecodeError:
#         logging.warning("Chyba dekódování dat ze sériového portu")
#       except Exception as e:
#         logging.error(f"Chyba při čtení ze sériového portu: {e}")
#         break # Ukončení naslouchání při chybě
#     if ser and not ser.is_open:
#       logging.error(f"Sériový port {serial_port} byl uzavřen.")
#     logging.debug("Vlákno pro naslouchání sériového portu ukončeno") # Logovani ukonceni vlakna

#   serial_thread = threading.Thread(target=listen, daemon=True)
#   serial_thread.start() # Spuštění naslouchání v samostatném vlákně

# def check_serial_thread():
#   global serial_thread
#   if serial_thread is None or not serial_thread.is_alive():
#     logging.warning("Vlákno pro naslouchání sériového portu nebeží, restartuji...")
#     start_serial_listener()

#   threading.Timer(1, check_serial_thread).start() # Naplánuj další kontrolu za 1 sekundu

# init_serial()
# check_serial_thread() # Spusť periodickou kontrolu vlákna

@app.route('/receivedata', methods=['POST'])
def receivedata():
  # global ser # Zakomentováno, protože ser se již nepoužívá
  try:
    data = request.get_json()
    logging.info(f"Přijatá data: {data}")

    # if ser and ser.is_open: # Zakomentováno, protože ser se již nepoužívá
    #   logging.debug(f"Odesílání dat na sériový port: {data}") # Logovani odesilani dat
    #   ser.write(str(data).encode())
#     #   return jsonify({"status": "success", "message": "Data received and sent to serial port"})
#     # else:
#     #   logging.warning("Sériový port není inicializován nebo otevřen, data nebyla odeslána.")
#     #   return jsonify({"status": "warning", "message": "Serial port not initialized or open, data not sent."}), 500

    # Změna reakce, když není sériový port aktivní
    logging.info("Sériový port je zakomentován, data nebudou odeslána.")
    return jsonify({"status": "info", "message": "Serial port functionality is currently disabled."})

  except Exception as e:
    logging.error(f"Chyba při zpracování dat: {e}")
    return jsonify({"status": "error", "message": str(e)}), 500
    
if __name__ == '__main__':
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    app.run(debug=True, port=5000)