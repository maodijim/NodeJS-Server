from threading import Timer
import subprocess
import datetime
import sys
time = datetime.datetime.now()
apMode = subprocess.check_output("ping 10.0.0.1 -c 1 -W 1 | grep '1 received' | wc -l", shell=True)

def test():
    try:
        if(not 'time=' in (subprocess.check_output("ping 8.8.8.8 -c 4 -W 15 | grep 'time='", shell=True))):
            subprocess.call(['sudo','ifdown','wlan0'])
            subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
            subprocess.call(['sudo','ifup','wlan0'])
    except subprocess.CalledProcessError as e:
        subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
        subprocess.call(['sudo','reboot'])

if(sys.argv[1] == 'check'):
    if (apMode[0] is '1'):
        print('AP Running')
        if ((time.minute % 6) == 0):
            subprocess.call(['sudo','ifdown','wlan0'])
            subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])
            subprocess.call(['sudo','ifup','wlan0'])
            Timer(30,test).start()
    else:
        try:
            if('time=' in (subprocess.check_output("ping 8.8.8.8 -c 4 -W 15 | grep 'time='", shell=True))):
                print('Internet good')
        except subprocess.CalledProcessError as e:
            print('Enable AP mode')
            subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])
            subprocess.call(['sudo','reboot'])


if(sys.argv[1] == 'start'):
    subprocess.call(['sudo','ifdown','wlan0'])
    subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])
    subprocess.call(['sudo','ifup','wlan0'])
