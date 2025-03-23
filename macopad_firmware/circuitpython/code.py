import board
import usb_cdc
import time

usb_serial = usb_cdc.data  # Použití datového sériového portu

print("Macropad: Start")  # Zpráva o spuštění
usb_serial.write("Macropad: Start\r\n".encode())

while True:
    try:
        if usb_serial:
            usb_serial.write("Macropad: Start\r\n".encode())  # Odeslání "Hello World"
        time.sleep(1)  # Čekání 1 sekundu
    except Exception as e:
        print(f"Macropad: Error: {e}")  # Logování chyb
        if usb_serial:
            usb_serial.write("Macropad: Error\r\n".encode())  # Odeslání chybové zprávy
        time.sleep(1)  # Čekání 1 sekundu