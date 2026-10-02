

function simpleClient(host){
    let s = new webSocket('ws://localhost:8080');
    s.connect((host, 8080));
    let msg = "Colton\r\n"
    s.send(msg.encode("utf-8"));

    response = s.recv(1024);

}