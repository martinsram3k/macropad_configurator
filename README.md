# StorageBuddy macropad configurator

Tento program je vytvořen pro macropad který vyvíjím 

## How to install

1. Naklonujte repozitár:
   ```bash
   git clone https://github.com/martinsram3k/macropad_configurator

# Project Overview

This project consists of three main components that work together to create a configurable macropad:

1.  **Frontend (HTML, CSS, JavaScript):** Provides a user interface for configuring macropad key functions.
2.  **Backend (Python Flask):** Serves as a bridge between the frontend and the macropad, receiving configurations and forwarding them.
3.  **Firmware (CircuitPython):** Runs on the macropad, processing configurations and executing key functions.

## How it Works

### Frontend (HTML, CSS, JavaScript)

* **HTML:**
    * Defines the structure of the web page, including the menu, macropad key display, layer selection controls, and a text area for entering key functions.
    * Uses `data-key` attributes to identify individual keys and layers.
* **CSS:**
    * Styles the web page, defining the appearance of the menu, keys, buttons, and other elements.
    * Creates a responsive design.
* **JavaScript (script.js):**
    * Handles user interactions.
    * Allows switching between macropad layers using buttons and layer indicators (dots).
    * Enables key selection and displays a text area for entering key functions.
    * Sends key configurations (key number, layer, function) to the backend using the `fetch` API.
    * Displays a confirmation message when data is successfully received from the server.

### Backend (Python Flask)

* **server.py:**
    * Uses Flask to create a web server.
    * Uses Flask-CORS to enable Cross-Origin Resource Sharing (CORS), allowing the frontend to communicate with the backend.
    * Initializes the serial port (COM6) for communication with the macropad.
    * Defines the `/receivedata` endpoint, which receives POST requests with key configurations from the frontend.
    * Currently the recived data is not send to the serial port.
    * processes the recived data (key number, layer, function)

### Firmware (CircuitPython)

* **Macropad Code:**
    * Initializes pins for the key matrix rows and columns.
    * Initializes the serial port for communication with the backend.
    * Initializes the keyboard for emulating key presses.
    * Defines a mapping of keys to functions (`key_map`).
    * The `process_serial_data()` function receives key configurations from the backend and updates the key mapping.
    * The `execute_function()` function executes the function associated with a given key (emulates key presses).
    * The `read_keys()` function reads key presses from the key matrix and calls `execute_function()`.
    * The main loop continuously reads data from the serial port and checks for key presses.

### Interaction Between Components

1.  The user configures keys on the frontend web page.
2.  The frontend sends the key configuration to the backend via an HTTP POST request.
3.  The backend receives the configuration and sends it to the serial port.
4.  The firmware on the macropad receives the configuration from the serial port and updates the key mapping.
5.  The user presses a key on the macropad.
6.  The firmware detects the key press and executes the corresponding function (emulates key presses).

### Key Points

* Communication between the frontend and backend occurs via HTTP and JSON.
* Communication between the backend and macropad occurs via the serial port.
* The macropad firmware uses CircuitPython and the `adafruit_hid` library for emulating key presses.
* The python backend code, does not yet send the data to the macropad.
   