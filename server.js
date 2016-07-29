#!/usr/bin/env node

const HID = require('node-hid')
const clients = [];
const unixSocket = '/tmp/pedals.sock';
const JsonSocket = require('json-socket');
const mapping = {
  0x0000: {"name": "pedalup"},
  0x0200: {"name": "pedaldown", "pedal": "center"},
  0x0100: {"name": "pedaldown", "pedal": "left"},
  0x0400: {"name": "pedaldown", "pedal": "right"}
}

var connectPedal = () => {
  try {
    return new HID.HID(1523, 255)
  }
  catch (e) {
    console.error(e)
    setTimeout(connectPedal, 1000)
  }
}


var pedalEvent = function(data){
  code = data.readInt16BE()
  event = mapping[code] || {}
  event.code = code
  return event
}

var notifyClients = (data) => {
  event = pedalEvent(data)
  console.log(event.code.toString(2));
  console.log("Notifying " + clients.length + " client(s)", event)
  clients.forEach((c) => {
    c.sendMessage(event)
  })
}

var pedal = connectPedal()

pedal.on("data", notifyClients)
pedal.on("error", (msg) => {
  console.error(msg)
  connectPedal()
})

var net = require('net');

// This server listens on a Unix socket at /var/run/mysocket
var server = net.createServer()
server.on('connection', (c) => {
  console.log('client connected');
  c = new JsonSocket(c);
  clients.push(c);
  c.on('close', () => {
    console.log('client disconnected');
    clients.splice(clients.indexOf(c), 1)
  });
});
server.on('error', (err) => {
  console.error(err);
});

server.listen(unixSocket);
