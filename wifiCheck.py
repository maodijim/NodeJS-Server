import threading
import subprocess
import datetime
import sys
time = datetime.datetime.now()
apMode = subprocess.check_output("ping 10.0.0.1 -c 1 -W 1 | grep '1 received' | wc -l", shell=True)

def reconnectmqtt():
    subprocess.call(["sudo", "pm2", "delete", "mqtt"])
    subprocess.call(["sudo", "pm2", "start", "/home/pi/Public/NodeJS-Server/mqtt.js"])

def test():
    try:
        if('from 8.8.8.8' in (subprocess.check_output("ping 8.8.8.8 -c 4 -W 15 | grep '8.8.8.8'", shell=True))):
            print('Reconnect to Internet')
            threading.Timer(15,reconnectmqtt).start()
    except subprocess.CalledProcessError as e:
        subprocess.call(['sudo','ifdown','wlan0'])
        subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
        subprocess.call(['sudo','service','hostapd','start'])
        subprocess.call(['sudo','service','dnsmasq','restart'])
        subprocess.call(['sudo','ifup','wlan0'])

if(sys.argv[1] == 'check'):
    if (apMode[0] is '1'):
        print('AP Running')
        if ((time.minute % 10) == 0):
            subprocess.call(['sudo','service','hostapd','stop'])
            subprocess.call(['sudo','ifdown','wlan0'])
            subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])
            subprocess.call(['sudo','ifup','wlan0'])
            threading.Timer(30,test).start()
    else:
        try:
            if('8.8.8.8' in (subprocess.check_output("ping 8.8.8.8 -c 3 -W 15 | grep '8.8.8.8'", shell=True))):
                print('Internet good')
        except subprocess.CalledProcessError as e:
            print('Enable AP mode')
            subprocess.call(['sudo','service','hostapd','start'])
            subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
            subprocess.call(['sudo','reboot'])


if(sys.argv[1] == 'start'):
    subprocess.call(['sudo','service','hostapd','stop'])
    subprocess.call(['sudo','ifdown','wlan0'])
    subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])
    subprocess.call(['sudo','ifup','wlan0'])
    threading.Timer(30,test).start()
