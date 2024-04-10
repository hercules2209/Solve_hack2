import serial


arduino_port = 'COM5'
baud_rate = 9600

# Open the serial port
ser = serial.Serial(arduino_port, baud_rate)

while True:
    # Read a line from the serial port
    line = ser.readline().decode('utf-8').strip()
    
    # Check if the line contains the UID
    if "Card UID:" in line:
        print(line)
