from __future__ import print_function
import cv2 as cv
import argparse
from flask import Flask, render_template, Response
import threading
from flask_cors import CORS






outputFrame = None
inputFrame = None
lock = threading.Lock()

max_value = 255
max_value_H = 360//2
low_H = 0
low_S = 0
low_V = 0
high_H = max_value_H
high_S = max_value
high_V = max_value
window_capture_name = 'Video Capture'
window_detection_name = 'Color Mask'
low_H_name = 'Low H'
low_S_name = 'Low S'
low_V_name = 'Low V'
high_H_name = 'High H'
high_S_name = 'High S'
high_V_name = 'High V'

low_H1 = 0
low_S1 = 0
low_V1 = 0
high_H1 = max_value_H
high_S1 = max_value
high_V1 = max_value
low_H1_name = 'Low H1'
low_S1_name = 'Low S1'
low_V1_name = 'Low V1'
high_H1_name = 'High H1'
high_S1_name = 'High S1'
high_V1_name = 'High V1'

def hue_mask():
    global outputFrame, lock, inputFrame
    global max_value, max_value_H, low_H, low_S, low_V, high_H, high_S, high_V, window_capture_name, window_detection_name, low_H_name, low_S_name, low_V_name, high_H_name, high_S_name, high_V_name
    global low_H1, low_S1, low_V1, high_H1, high_S1, high_V1, low_H1_name, low_S1_name, low_V1_name, high_H1_name, high_S1_name, high_V1_name
    numBoxes = 0


    def on_low_H_thresh_trackbar(val):
        global low_H
        global high_H
        low_H = val
        low_H = min(high_H-1, low_H)
        cv.setTrackbarPos(low_H_name, window_detection_name, low_H)
    def on_high_H_thresh_trackbar(val):
        global low_H
        global high_H
        high_H = val
        high_H = max(high_H, low_H+1)
        cv.setTrackbarPos(high_H_name, window_detection_name, high_H)
    def on_low_S_thresh_trackbar(val):
        global low_S
        global high_S
        low_S = val
        low_S = min(high_S-1, low_S)
        cv.setTrackbarPos(low_S_name, window_detection_name, low_S)
    def on_high_S_thresh_trackbar(val):
        global low_S
        global high_S
        high_S = val
        high_S = max(high_S, low_S+1)
        cv.setTrackbarPos(high_S_name, window_detection_name, high_S)
    def on_low_V_thresh_trackbar(val):
        global low_V
        global high_V
        low_V = val
        low_V = min(high_V-1, low_V)
        cv.setTrackbarPos(low_V_name, window_detection_name, low_V)
    def on_high_V_thresh_trackbar(val):
        global low_V
        global high_V
        high_V = val
        high_V = max(high_V, low_V+1)
        cv.setTrackbarPos(high_V_name, window_detection_name, high_V)
    ##
    def on_low_H1_thresh_trackbar(val):
        global low_H1
        global high_H1
        low_H1 = val
        low_H1 = min(high_H1-1, low_H1)
        cv.setTrackbarPos(low_H1_name, window_detection_name, low_H1)
    def on_high_H1_thresh_trackbar(val):
        global low_H1
        global high_H1
        high_H1 = val
        high_H1 = max(high_H1, low_H1+1)
        cv.setTrackbarPos(high_H1_name, window_detection_name, high_H1)
    def on_low_S1_thresh_trackbar(val):
        global low_S1
        global high_S1
        low_S1 = val
        low_S1 = min(high_S1-1, low_S1)
        cv.setTrackbarPos(low_S1_name, window_detection_name, low_S1)
    def on_high_S1_thresh_trackbar(val):
        global low_S1
        global high_S1
        high_S1 = val
        high_S1 = max(high_S1, low_S1+1)
        cv.setTrackbarPos(high_S1_name, window_detection_name, high_S1)
    def on_low_V1_thresh_trackbar(val):
        global low_V1
        global high_V1
        low_V1 = val
        low_V1 = min(high_V1-1, low_V1)
        cv.setTrackbarPos(low_V1_name, window_detection_name, low_V1)
    def on_high_V1_thresh_trackbar(val):
        global low_V1
        global high_V1
        high_V1 = val
        high_V1 = max(high_V1, low_V1+1)
        cv.setTrackbarPos(high_V1_name, window_detection_name, high_V1)
    ##
    def numBoxes_trackbar(val):
        
        numBoxes = val
        cv.setTrackbarPos("n", window_detection_name, numBoxes)

    URL = "http://192.168.1.49"

    cap = cv.VideoCapture(URL + ":81/stream")
    # cv.namedWindow(window_capture_name)
    cv.namedWindow(window_detection_name, cv.WINDOW_NORMAL)

    cv.createTrackbar(low_H_name, window_detection_name , low_H, max_value_H, on_low_H_thresh_trackbar)
    cv.createTrackbar(high_H_name, window_detection_name , high_H, max_value_H, on_high_H_thresh_trackbar)
    cv.createTrackbar(low_S_name, window_detection_name , low_S, max_value, on_low_S_thresh_trackbar)
    cv.createTrackbar(high_S_name, window_detection_name , high_S, max_value, on_high_S_thresh_trackbar)
    cv.createTrackbar(low_V_name, window_detection_name , low_V, max_value, on_low_V_thresh_trackbar)
    cv.createTrackbar(high_V_name, window_detection_name , high_V, max_value, on_high_V_thresh_trackbar)

    cv.createTrackbar(low_H1_name, window_detection_name , low_H1, max_value_H, on_low_H1_thresh_trackbar)
    cv.createTrackbar(high_H1_name, window_detection_name , high_H1, max_value_H, on_high_H1_thresh_trackbar)
    cv.createTrackbar(low_S1_name, window_detection_name , low_S1, max_value, on_low_S1_thresh_trackbar)
    cv.createTrackbar(high_S1_name, window_detection_name , high_S1, max_value, on_high_S1_thresh_trackbar)
    cv.createTrackbar(low_V1_name, window_detection_name , low_V1, max_value, on_low_V1_thresh_trackbar)
    cv.createTrackbar(high_V1_name, window_detection_name , high_V1, max_value, on_high_V1_thresh_trackbar)

    cv.createTrackbar("n", window_detection_name, numBoxes, 100, numBoxes_trackbar)
    
    while True:
        
        ret, frame = cap.read()
        if frame is None:
            break
        frame_HSV = cv.cvtColor(frame, cv.COLOR_BGR2HSV)
        mask = cv.inRange(frame_HSV, (low_H, low_S, low_V), (high_H, high_S, high_V))
        mask1 = cv.inRange(frame_HSV, (low_H1, low_S1, low_V1), (high_H1, high_S1, high_V1))
        netMask = mask + mask1
        masked = cv.bitwise_and(frame,frame, mask=netMask)
        # mask = cv.GaussianBlur(mask, (5,5), 0)
        # remove_isolated_pixels(mask)
        # mask = cv.threshold(mask, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU)[1]
        # mask = remove_isolated_pixels(mask)

        # contours,_ = cv.findContours(mask, cv.RETR_TREE, cv.CHAIN_APPROX_NONE)
        # contours = sorted(contours, key=cv.contourArea, reverse=True)

        # for i in range(2):
        #     if i >= len(contours): break
        #     #if any contours are found we take the biggest contour and get bounding box
        #     (x_min, y_min, box_width, box_height) = cv.boundingRect(contours[i])
        #     #drawing a rectangle around the object with 15 as margin
        #     cv.rectangle(frame, (x_min - 15, y_min -15),
        #                 (x_min + box_width + 15, y_min + box_height + 15),
        #                 (0,255,0), 4)

        # if contours:
        #     #if any contours are found we take the biggest contour and get bounding box
        #     (x_min, y_min, box_width, box_height) = cv.boundingRect(contours[0])
        #     #drawing a rectangle around the object with 15 as margin
        #     cv.rectangle(frame, (x_min - 15, y_min -15),
        #                   (x_min + box_width + 15, y_min + box_height + 15),
        #                   (0,255,0), 4)
        
        # cv.imshow(window_capture_name, mask1)
        # cv.imshow(window_detection_name, mask)
        # cv.imshow("combined", masked)
        key = cv.waitKey(1)
        if key == ord('q') or key == 27:
            break
        with lock:
            outputFrame = masked.copy()
            inputFrame = frame.copy()

##########################


animation_code = "wait"

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

def gen():
    global outputFrame, lock
    while True:
        with lock:
            if outputFrame is None:
                continue
            
            (flag, encodedImage) = cv.imencode(".jpg", outputFrame)
            if not flag:
                continue
            
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

def genOriginal():
    global inputFrame, lock
    while True:
        with lock:
            if inputFrame is None:
                continue
            
            (flag, encodedImage) = cv.imencode(".jpg", inputFrame)
            if not flag:
                continue
            
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/live_stream')
def live_stream():
    return Response(genOriginal(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_animation')
def start_animation():
    global animation_code
    animation_code = "start"
    return "hello"

@app.route('/animation_status')
def animation_status():
    global animation_code
    if (animation_code == "start"):
        animation_code = "wait"
        return {
            "animation_status": "start"
        }
    return {
        "animation_status": animation_code
    }

if __name__ == '__main__':
    t = threading.Thread(target=hue_mask)
    t.daemon = True
    t.start()

    app.run(host='0.0.0.0', port="8080", debug=True, threaded=True, use_reloader=False)
    # app.run(host='0.0.0.0', threaded=True)