import os.path
import json
from getID import getId
fileExist = (os.path.exists('/home/pi/Public/NodeJS-Server/file'));

if fileExist:
    print('file found')
    print getId()
    if os.path.getsize('/home/pi/Public/NodeJS-Server/fileCheck.py')<1:
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
