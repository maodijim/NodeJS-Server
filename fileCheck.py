import os.path
import json
from getID import getId
import datetime
import urllib
import subprocess

time = datetime.datetime.now()
fileExist = (os.path.exists('/home/pi/Public/NodeJS-Server/file'));

if fileExist:
    print('file found')
    '''print getId()'''
    if os.path.getsize('/home/pi/Public/NodeJS-Server/file')<1:
        name = json.dumps({ "devices": [], "id":getId()})
        file = open('/home/pi/Public/NodeJS-Server/file','w')
        file.write(name)
        file.close()
else:
    print('file not found')
    name = json.dumps({ "devices": [], "id":getId()})
    #name = '{ "devices": [], "id":'+getId()+'}'
    file = open('/home/pi/Public/NodeJS-Server/file','w')
    file.write(name)
    file.close()

if ((time.minute % 5) == 0):
    ip = subprocess.check_output("ifconfig wlan0|egrep -o 'inet addr:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'",shell=True)
    params = urllib.urlencode({'ip_addr':ip[10:],'uid':getId()})
    result = urllib.urlopen('http://wireless.worldelectronicaccessory.com/jsonTest.php',params)
    result.close()
