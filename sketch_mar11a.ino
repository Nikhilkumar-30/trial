




#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Error 404";
const char* password = "77777777";

const char* supabaseUrl = "https://vrrqyefzohsorndqxdjl.supabase.co";
const char* supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycnF5ZWZ6b2hzb3JuZHF4ZGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2ODUzODMsImV4cCI6MjA1NzI2MTM4M30.qv85Bp36mMOASX_y3z6UFW7Lar4JSGXZ9WLSUK8rTWE";



WiFiClientSecure client;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Disable SSL certificate verification (not recommended for production)
  client.setInsecure();
}

void sendDataToSupabase(float temp, float hum) {
  String url = String(supabaseUrl) + "/rest/v1/sensor_data";

  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));

  // Create JSON payload
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["temperature"] = temp;
  jsonDoc["humidity"] = hum;

  String requestBody;
  serializeJson(jsonDoc, requestBody);
  
  Serial.println("Sending Data: " + requestBody);

  int httpResponseCode = http.POST(requestBody);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  Serial.println(http.getString());  // Show full response

  http.end();
}

void loop() {
  // Generate random temperature (20°C - 35°C) and humidity (40% - 90%)
  float temp = random(200, 350) / 10.0;
  float hum = random(400, 900) / 10.0;

  Serial.print("Generated Temperature: ");
  Serial.print(temp);
  Serial.print("°C, Humidity: ");
  Serial.print(hum);
  Serial.println("%");

  sendDataToSupabase(temp, hum);

  delay(10000);  // Send data every 10 seconds
}
