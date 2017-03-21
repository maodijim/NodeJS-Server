
'''
Author: Andy Mao
Chekc ID in database if incorrect update database and send ip address to server
'''
import os
import json
from getID import getId
import datetime
import urllib
import subprocess
import MySQLdb
import sys

os.chmod('/home/pi/Public/NodeJS-Server/codesend',0711);
os.chmod('/home/pi/Public/NodeJS-Server/RFSniffer1',0711);
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
    print ('not match')
else:
    print ('id match')

db.close()

if ((time.minute % 5) == 0):
    ip = subprocess.check_output("ifconfig wlan0|egrep -o 'inet addr:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'",shell=True)
    params = urllib.urlencode({'ip_addr':ip[10:],'uid':getId()})
    result = urllib.urlopen('https://www.wswitch.net/jsonTest.php',params)
    result.close()

if(sys.argv[1] == 'run'):
    ip = subprocess.check_output("ifconfig wlan0|egrep -o 'inet addr:[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}'",shell=True)
    params = urllib.urlencode({'ip_addr':ip[10:],'uid':getId()})
    result = urllib.urlopen('https://www.wswitch.net/jsonTest.php',params)
    result.close()
