import serial.tools.list_ports

# Získání seznamu dostupných sériových portů
ports = list(serial.tools.list_ports.comports())

if not ports:
    print("❌ Žádné sériové zařízení nenalezeno. Zkontroluj připojení KB2040.")
else:
    for port in ports:
        print(f"✅ Nalezen port: {port.device} - {port.description}")
