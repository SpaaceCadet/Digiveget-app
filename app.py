from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_session import Session
from sqlalchemy import create_engine, MetaData, Table, select, Column, Float, String
from sqlalchemy.orm import sessionmaker
from models.sensor_data import Base as sensorbase ,SensorData
from sqlalchemy.engine import URL 

from  models.users  import Base as userbase, User 
import os
from dotenv import load_dotenv

load_dotenv()

# Connection details

DRIVER_SQL = os.getenv("DRIVER_SQL")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
PORT = os.getenv("PORT")
DATABASE = os.getenv("DATABASE")
DRIVER = os.getenv("DRIVER")
TRUST = os.getenv("TRUST")


connection_url = URL.create(
    DRIVER_SQL,
    username=USERNAME,
    password=PASSWORD,
    host=HOST,
    port=int(PORT),
    database=DATABASE,
    query={
        "driver": DRIVER,
        "TrustServerCertificate": TRUST,
    },
)

# Connect to the SQL Server using SQLAlchemy

engine = create_engine(connection_url)
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

    # Create tables in the database
sensorbase.metadata.create_all(engine)
userbase.metadata.create_all(engine)

    # Create a session to interact with the database
Session = sessionmaker(bind=engine)

db_session = Session()

def fetch_data():
    # Query data from the SensorData table
    data = db_session.query(SensorData).order_by(SensorData.datetime.desc()).limit(2880).all()
    return data

@app.route('/get_temperature_data')
def get_temperature_data():
       if not session.get('authenticated'):
        return render_template('login.html')  # Display login form if not authenticated
       else: 
        data = fetch_data()
        
        temperature_data = {
            'datetime': [entry.datetime for entry in data],
            'temperature': [entry.temperature for entry in data],
            'humidite': [entry.humidity for entry in data],
            'moisture': [entry.soil_moisture for entry in data]
                }
        
        return jsonify(temperature_data)

@app.route('/get_gauge_data')
def get_gauge_data():
    # Query data from the SensorData table
    if not session.get('authenticated'):
        return render_template('login.html')  # Display login form if not authenticated
    else:
        data = db_session.query(SensorData.soil_moisture).order_by(SensorData.datetime.desc()).limit(1).all()

        data = {
            'datos': [float(entry[0]) for entry in data]
        }
        return jsonify(data)  

@app.route('/get_gauge_temp')
def get_gauge_temp():
    # Query data from the SensorData table
    if not session.get('authenticated'):
        return render_template('login.html')  # Display login form if not authenticated
    else:
        data = db_session.query(SensorData.temperature).order_by(SensorData.datetime.desc()).limit(1).all()

        data = {
            'datos': [float(entry[0]) for entry in data]
        }
        return jsonify(data)  

@app.route('/get_gauge_humid')
def get_gauge_humid():
    # Query data from the SensorData table
    data = db_session.query(SensorData.humidity).order_by(SensorData.datetime.desc()).limit(1).all()

    data = {
        'datos': [float(entry[0]) for entry in data]
    }
    return jsonify(data)   

@app.route('/')
def index():
    if not session.get('authenticated'):
        return render_template('login.html',message=session.get("message"))  # Display login form if not authenticated
    data = fetch_data()
    return render_template('index.html', records=data)

@app.route('/login', methods=['POST','GET'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')

    # Perform your login authentication logic here
    # For demonstration purposes, let's check if username and password are not empty
    if username and password:
        user = db_session.query(User).filter(User.username == username, User.password == password).first()
        if user:
            
            session["authenticated"] = True
            session["username"] = username
        else:
        
             session["message"]="Incorrect username or password"

    # Login failed, redirect to login page
    return redirect(url_for('index'))

@app.route('/about')
def about():
    if session.get("authenticated"):
        return render_template('about.html')
    else:
        return render_template("login.html")

@app.route("/logout")
def logout():
    session["authenticated"] = None
    session["username"] = None
    session["message"] = None
    return render_template("login.html")

if __name__ == '__main__':
    app.run(debug=True)
