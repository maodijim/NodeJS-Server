import subprocess  
import sys
apMode = subprocess.check_output("ping 10.0.0.1 -c 1 -W 1 | grep '1 received' | wc -l", shell=True)
if(sys.argv[1] == 'check'):
    if (apMode[0] is '1'):
        print('everything good')
    elif((subprocess.check_output("ping 8.8.8.8 -c 1 -W 1 | grep '1 received' | wc -l", shell=True)[0])== '1'):
        print('Internet good')
    else:
        print('Enable AP mode')
#subprocess.call(['sudo','ifdown','wlan0'])
        subprocess.call(['sudo','cp','/etc/network/interfaces2','/etc/network/interfaces'])    
        subprocess.call(['sudo','reboot'])
#subprocess.call(['sudo','hostapd','/etc/hostapd/hostapd.conf'])

if(sys.argv[1] == 'start'):    
    subprocess.call(['sudo','ifdown','wlan0'])
    subprocess.call(['sudo','cp','/etc/network/interfaces1','/etc/network/interfaces'])    
    subprocess.call(['sudo','ifup','wlan0'])
