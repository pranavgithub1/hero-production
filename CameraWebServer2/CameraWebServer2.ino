#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

//
// WARNING!!! PSRAM IC required for UXGA resolution and high JPEG quality
//            Ensure ESP32 Wrover Module or other board with PSRAM is selected
//            Partial images will be transmitted if image exceeds buffer size
//
//            You must select partition scheme from the board menu that has at least 3MB APP space.
//            Face Recognition is DISABLED for ESP32 and ESP32-S2, because it takes up from 15 
//            seconds to process single frame. Face Detection is ENABLED if PSRAM is enabled as well

// ===================
// Select camera model
// ===================
//#define CAMERA_MODEL_WROVER_KIT // Has PSRAM
// #define CAMERA_MODEL_ESP_EYE // Has PSRAM
//#define CAMERA_MODEL_ESP32S3_EYE // Has PSRAM
//#define CAMERA_MODEL_M5STACK_PSRAM // Has PSRAM
//#define CAMERA_MODEL_M5STACK_V2_PSRAM // M5Camera version B Has PSRAM
//#define CAMERA_MODEL_M5STACK_WIDE // Has PSRAM
//#define CAMERA_MODEL_M5STACK_ESP32CAM // No PSRAM
//#define CAMERA_MODEL_M5STACK_UNITCAM // No PSRAM
#define CAMERA_MODEL_AI_THINKER // Has PSRAM
//#define CAMERA_MODEL_TTGO_T_JOURNAL // No PSRAM
// ** Espressif Internal Boards **
//#define CAMERA_MODEL_ESP32_CAM_BOARD
//#define CAMERA_MODEL_ESP32S2_CAM_BOARD
//#define CAMERA_MODEL_ESP32S3_CAM_LCD

#include "camera_pins.h"

// ===========================
// Enter your WiFi credentials
// ===========================
// const char* ssid = "8D555F";
// const char* password = "72T76B2B01009";
// const char* ssid = "Pranav's Galaxy S22";
// const char* password = "qwcd1168";
const char* ssid = "beasley2.4";
const char* password = "rapidbug363";

// WiFiServer server(3001);
// // Current time
// unsigned long currentTime = millis();
// // Previous time
// unsigned long previousTime = 0; 
// // Define timeout time in milliseconds (example: 2000ms = 2s)
// const long timeoutTime = 2000;

void startCameraServer();
void setupLedFlash(int pin);




#define trigger 12
#define echo 13
#define direction 2
#define motor 14
#define turretpulse 4
#define button 15
#define led 3









void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();

  pinMode(trigger, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(motor, OUTPUT);
  pinMode(direction, OUTPUT);
  pinMode(turretpulse, OUTPUT);
  pinMode(led, OUTPUT);
  pinMode(button, INPUT);

  digitalWrite(led, LOW);



  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_UXGA;
  config.pixel_format = PIXFORMAT_JPEG; // for streaming
  //config.pixel_format = PIXFORMAT_RGB565; // for face detection/recognition
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;
  
  // if PSRAM IC present, init with UXGA resolution and higher JPEG quality
  //                      for larger pre-allocated frame buffer.
  if(config.pixel_format == PIXFORMAT_JPEG){
    if(psramFound()){
      config.jpeg_quality = 10;
      config.fb_count = 2;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      // Limit the frame size when PSRAM is not available
      config.frame_size = FRAMESIZE_SVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  } else {
    // Best option for face detection/recognition
    config.frame_size = FRAMESIZE_240X240;
#if CONFIG_IDF_TARGET_ESP32S3
    config.fb_count = 2;
#endif
  }

#if defined(CAMERA_MODEL_ESP_EYE)
  pinMode(13, INPUT_PULLUP);
  pinMode(14, INPUT_PULLUP);
#endif

  // camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t * s = esp_camera_sensor_get();
  // initial sensors are flipped vertically and colors are a bit saturated
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1); // flip it back
    s->set_brightness(s, 1); // up the brightness just a bit
    s->set_saturation(s, -2); // lower the saturation
  }
  // drop down frame size for higher initial frame rate
  if(config.pixel_format == PIXFORMAT_JPEG){
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

#if defined(CAMERA_MODEL_M5STACK_WIDE) || defined(CAMERA_MODEL_M5STACK_ESP32CAM)
  s->set_vflip(s, 1);
  s->set_hmirror(s, 1);
#endif

#if defined(CAMERA_MODEL_ESP32S3_EYE)
  s->set_vflip(s, 1);
#endif

// Setup LED FLash if LED pin is defined in camera_pins.h
#if defined(LED_GPIO_NUM)
  setupLedFlash(LED_GPIO_NUM);
#endif

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");

  startCameraServer();

  Serial.print("Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("' to connect");


  delay(500);
  digitalWrite(led, HIGH);
  // server.begin();
}

String serverUrl = "http://192.168.1.83:8080/start_animation";

void start_animation() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Sending request");
    HTTPClient http;
    http.begin(serverUrl);
    http.setConnectTimeout(5000);
    http.setTimeout(5000);
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  else {
    Serial.println("Wifi Disconnected");
  }
}

void loop() {
  if (!digitalRead(button)) {
    while (!digitalRead(button)) {
      delay(10);
    }
    run();
  }
}

void rotate(int deg, int direction1) {
  digitalWrite(direction, direction1);
  int pulses = deg * 6400 / 360;
  for (int i = 0; i < pulses; i++) {
    digitalWrite(turretpulse, HIGH);
    delayMicroseconds(500);
    digitalWrite(turretpulse, LOW);
    delayMicroseconds(500);
  }
}

void run() {
  //digitalWrite(motor, HIGH);
  //delay(500);
  //digitalWrite(motor, LOW);

  delay(500);

  rotate(180, 1);
  start_animation();
  rotate(360, 0);
  rotate(180, 1);

}





// String header;
// String animation_status = "wait";
// void loop() {
//   // Do nothing. Everything is done in another task by the web server
//   // delay(10000);
//   WiFiClient client = server.available();
//   if (client) {
//     currentTime = millis();
//     previousTime = currentTime;
//     Serial.println("New Client.");
//     String currentLine = "";
//     while (client.connected() && currentTime - previousTime <= timeoutTime) {
//       currentTime = millis();
//       if (client.available()) {
//         char c = client.read();
//         Serial.write(c);
//         header += c;
//         // end of request ; send response
//         if (c == '\n') {
//           if (currentLine.length() == 0) {
//             client.println("HTTP/1.1 200 OK");
//             client.println("Content-type:application/json");
//             // client.println("Connection: close");
//             client.println();

//             // client.println("<!DOCTYPE html><html>");
//             // client.println("<body><h1>ESP32 Web Server</h1>");
//             // client.println("</body></html>");
//             client.println("{");
//             client.print("\"Animation-Status\": \"");
//             client.print(animation_status);
//             client.println("\"");
//             client.println("}");
//           }
//           else {
//             currentLine = "";
//           }
//         }
//         else if (c != '\r') {
//           currentLine += c;
//         }        
//       }
//     }
//     header = "";
//     client.stop();
//     Serial.println("Client disconnected");
//     Serial.println("");
//   }
// }
