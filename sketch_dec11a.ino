
// Sensor pins
#include <dht.h>
#define DHT11_PIN 7
#define sensorPower 4
#define sensorPin A3
#define INTERVAL 4000
dht DHT;
const int DryValue = 1006;
const int WetValue = 450;
unsigned long previousMillis = 0;

void setup() {
  pinMode(sensorPower, OUTPUT);
  
  // Initially keep the sensor OFF
  digitalWrite(sensorPower, LOW);
  
  Serial.begin(9600);
}

void loop() {
  // Get the reading from the function below and print it
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= INTERVAL) {
    previousMillis = currentMillis;
    
    // Turn the sensor ON
    digitalWrite(sensorPower, HIGH); 
    delay(10);  // Allow power to settle
    
    // Determine soil moisture percentage 
    int val = analogRead(sensorPin);  // Read the analog value from the sensor
    digitalWrite(sensorPower, LOW);   // Turn the sensor OFF
    

    
    int soilMoisturePercent = map(val, DryValue, WetValue, 0, 100);
    
    // Keep values between 0 and 100
    soilMoisturePercent = constrain(soilMoisturePercent, 0, 100);
    
    // Print to the serial monitor
    Serial.print("Humidity_percentage = ");  
    Serial.println(soilMoisturePercent);

    int chk = DHT.read11(DHT11_PIN);
    Serial.print("Temperature = ");
    Serial.println(DHT.temperature);
    Serial.print("Humidity = ");
    Serial.println(DHT.humidity);
  }
}
