import MySQLdb
import json
db = MySQLdb.connect(host = "localhost",
		     user="switch",
		     passwd="newswitch",
		     db="switches")
cur = db.cursor()
cur.execute("SELECT * from id")
for row in cur.fetchall():
    id = row[0]

cur.execute("SELECT * from devices")
arr = []
for row in cur.fetchall():
    arr.append({"device":row[0],"status":row[1],"codeON":row[2],"codeOFF":row[3],"nickname":row[4]})
print (json.dumps({ "devices": arr, "id":id}))
