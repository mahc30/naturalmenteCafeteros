import urllib.request
import json      
import random
import time

body = {}

while True:
    time.sleep(0.5)
    body = {
	"temperature": random.uniform(12,30),
	"ph": random.uniform(4.5,6),
	"co": random.uniform(500,1200),
	"pa": random.uniform(15,26),
	"hum": random.uniform(65,95),
    "id_cultivo": random.randrange(0,3)
}

    myurl = "http://localhost:3000/save"
    req = urllib.request.Request(myurl)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsondata = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')   # needs to be bytes
    req.add_header('Content-Length', len(jsondataasbytes))
    print (jsondataasbytes)
    response = urllib.request.urlopen(req, jsondataasbytes)
