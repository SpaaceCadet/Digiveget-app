from sqlalchemy import Column, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data2'
    datetime = Column(DateTime, primary_key=True)
    humidity = Column(Float)
    soil_moisture = Column(Float)
    temperature = Column(Float)