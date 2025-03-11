import board
import usb_cdc
import json
import digitalio
import time
import adafruit_hid
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode

# Definice pinů pro řádky
rows = [digitalio.DigitalInOut(pin) for pin in (board.P07, board.PE6, board.PB4)]
for row in rows:
    row.direction = digitalio.Direction.INPUT
    row.pull = digitalio.Pull.DOWN

# Definice pinů pro sloupce
cols = [digitalio.DigitalInOut(pin) for pin in (board.P01, board.P00, board.P04)]
for col in cols:
    col.direction = digitalio.Direction.OUTPUT
    col.value = False

# Definice pinu pro direct tlačítko
direct_button = digitalio.DigitalInOut(board.PB5)
direct_button.direction = digitalio.Direction.INPUT
direct_button.pull = digitalio.Pull.DOWN

# Inicializace sériového portu
usb_serial = usb_cdc.serial

# Inicializace klávesnice
keyboard = Keyboard(adafruit_hid.keyboard.Keyboard.report_descriptor, usb_serial)
keyboard_layout = KeyboardLayoutUS(keyboard)

# Mapování kláves na funkce
key_map = {}

def process_serial_data():
    if usb_serial.in_waiting > 0:
        data = usb_serial.readline().decode('utf-8').strip()
        try:
            json_data = json.loads(data)
            button = json_data.get('button')
            layer = json_data.get('layer')
            function = json_data.get('function')
            key_map[(layer, button)] = function
            print(f"Mapování aktualizováno: {layer}, {button}, {function}")
        except (ValueError, KeyError) as e:
            print(f"Chyba při parsování dat: {e}")

def execute_function(layer, button):
    function = key_map.get((layer, button))
    if function:
        print(f"Provádím funkci: {function}")
        # Implementace provádění funkce (odesílání klávesových zkratek, atd.)
        if function == "ctrl+c":
            keyboard.press(Keycode.CONTROL, Keycode.C)
            keyboard.release_all()
        elif function == "ctrl+v":
            keyboard.press(Keycode.CONTROL, Keycode.V)
            keyboard.release_all()
        elif function == "alt+tab":
            keyboard.press(Keycode.ALT, Keycode.TAB)
            keyboard.release_all()
        # ... atd.
    else:
        print("Funkce nenalezena")

def read_keys():
    # Čtení matice kláves
    for col_num, col in enumerate(cols):
        col.value = True
        for row_num, row in enumerate(rows):
            if row.value:
                print(f"Klávesa {row_num}, {col_num} stisknuta")
                execute_function(1, (row_num * 3) + col_num + 1) # Předpokládáme, že vrstva 1 je aktivní
        col.value = False

    # Čtení direct tlačítka
    if direct_button.value:
        print("Direct tlačítko stisknuto")
        execute_function(1, 10) # Předpokládáme, že direct tlačítko je klávesa 10

# Hlavní smyčka
while True:
    process_serial_data()
    read_keys()
    time.sleep(0.1)