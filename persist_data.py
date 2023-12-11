import serial
import pyodbc
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

# MySQL server configuration

DRIVER_SQL = os.getenv("DRIVER_SQL")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DATABASE = os.getenv("DATABASE")
DRIVER = os.getenv("DRIVER")
TRUST = os.getenv("TRUST")

# Serial port configuration
serial_port = '/dev/ttyACM0' 
baud_rate = 9600

# Connect to the MySQL server
connectionString = f'DRIVER={{ODBC Driver 18 for SQL Server}};SERVER={HOST};DATABASE={DATABASE};UID={USERNAME};PWD={PASSWORD}'



conn = pyodbc.connect(connectionString)
cursor = conn.cursor()

# Create the table if it doesn't exist


# Main loop to read data from the serial port
with serial.Serial(serial_port, baud_rate) as ser:
    while True:
        line = ser.readline().decode('utf-8').strip()
        print(line)

        if line.startswith('Humidity_percentage'):
            try:
                _, humidity_percentage_str = line.split('=')
                humidity_percentage = float(humidity_percentage_str)
                temperature = float(ser.readline().decode('utf-8').strip().split('=')[1])
                humidity = float(ser.readline().decode('utf-8').strip().split('=')[1])

                current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                print(f'Date: {current_date} Humidity: {humidity}%  Temperature: {temperature}°C Soil Moisture: {humidity_percentage}%')

                # Insert data into MySQL table
                insert_sql = "INSERT INTO sensor_data2 (datetime, humidity, temperature, soil_moisture) VALUES (?, ?, ?, ?)"
                cursor.execute(insert_sql, str(current_date), float(humidity), float(temperature), float(humidity_percentage))
                conn.commit()
            except ValueError as e:
                print(f"Error converting data: {e}")

# Close the MySQL connection
cursor.close()
conn.close()