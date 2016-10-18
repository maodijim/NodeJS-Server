import os.path
import json
from getID import getId
import datetime
import urllib
import subprocess
import MySQLdb

db = MySQLdb.connect(host = "localhost",
		     user="switch",
		     passwd="newswitch",
		     db="switches")
cur = db.cursor()
cur.execute("SELECT * from id")
time = datetime.datetime.now()

for row in cur.fetchall():
    id = row[0]

if id != getId():
    print id
    cur.execute("DELETE FROM `id`")
    cur.execute("""INSERT INTO `id` value (%s)""",(getId()))
    db.commit()
	'''data = json.dumps({ "devices": [], "id":getId()})
    file = open('/home/pi/Public/NodeJS-Server/file','w')
    file.write(data)
    file.close()'''
    print ('not match')
else:
    print ('id match')

db.close()

if ((time.minute % 5) == 0):
    ip = subprocess.check_output("ifconfig wlan0|egrep -o 'inet addr:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'",shell=True)
    params = urllib.urlencode({'ip_addr':ip[10:],'uid':getId()})
    result = urllib.urlopen('http://wireless.worldelectronicaccessory.com/jsonTest.php',params)
    result.close()
