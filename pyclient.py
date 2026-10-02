from socket import *

def simpleClient(host):
    s = socket()
    s.connect((host, 8080))
    msg = "Colton\r\n"
    s.send(msg.encode("utf-8"))

    response = s.recv(1024)
    data = response.decode("utf-8")
    print(data)
    s.close()


simpleClient("192.168.0.225")