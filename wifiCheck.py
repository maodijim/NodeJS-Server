'''
Author: Andy Mao

Check wifi or AP mode
'''
import threading
import subprocess
import datetime
import sys
time = datetime.datetime.now()
apMode = subprocess.check_output("ping 10.0.0.1 -c 1 -W 1 | grep '1 received' | wc -l", shell=True)

def reconnectmqtt():
    subprocess.call(["sudo", "pm2", "delete", "mqtt"])
    subprocess.call(["sudo", "pm2", "--cwd", "/home/pi/Public/NodeJS-Server/", "start", "/home/pi/Public/NodeJS-Server/mqtt.js"])
def test():
    try:
        if('from 8.8.8.8' in (subprocess.check_output("ping 8.8.8.8 -c 4 -W 15 | grep '8.8.8.8'", shell=True))):
            print('Reconnect to Internet')
    except subprocess.CalledProcessError as e:
        subprocess.call(['sudo','ifdown','wlan0'])
        subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
        subprocess.call(['sudo','service','hostapd','start'])
        subprocess.call(['sudo','service','dnsmasq','restart'])
        subprocess.call(['sudo','ifup','wlan0'])

def wifiExisted():
    saved_wifiList = []
    wifiList = subprocess.Popen(['sudo iwlist wlan0 scan | egrep "ESSID"'],
                                    shell=True, stdout = subprocess.PIPE, stderr = subprocess.STDOUT)
    wifiList = wifiList.stdout.readlines()

    with open("/etc/wpa_supplicant/wpa_supplicant.conf","r") as f:
        result = f.readlines()
    for val in result:
        if 'ssid=' in val:
            saved_wifiList.append(val[val.index('"')+1:len(val)-2])
    for val in wifiList:
        val = val.decode("utf-8") #python 3+ compatible
        val = val[val.index('"')+1:len(val)-2]
        if val in saved_wifiList:
            return True
    return False

if(len(sys.argv) < 1):
        print("wrong command")
elif(sys.argv[1] == 'check'):
    if (apMode[0] is '1'):
        print('AP Running')
        if ((time.minute % 3) == 0 & wifiExisted()):
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
elif(sys.argv[1] == 'start'):
    subprocess.call(['sudo','service','hostapd','stop'])
    subprocess.call(['sudo','ifdown','wlan0'])
    subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])
    subprocess.call(['sudo','ifup','wlan0'])
    threading.Timer(30,test).start()
