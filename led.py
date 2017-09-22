import RPi.GPIO as GPIO
import time
from threading import Thread

GPIO.setmode(GPIO.BCM)
def led_thread(pin,freq):
    GPIO.setup(pin,GPIO.OUT)
    dim = GPIO.PWM(pin,freq)
    dim.start(100)
    try:
        while True:
            for i in range(0,100):
                dim.ChangeDutyCycle(i)
                time.sleep(0.01)
            for i in range(0,100):
                dim.ChangeDutyCycle(100-i)
                time.sleep(0.01)
    except KeyboardInterrupt:
        pass
    dim.stop()
    GPIO.cleanup()


led1 = Thread(target = led_thread,args = (4,100))
led1.start()
time.sleep(0.15)
'''led2 = Thread(target = led_thread,args = (13,))
led2.start()
time.sleep(0.15)'''
led3 = Thread(target = led_thread,args = (18,100))
led3.start()
