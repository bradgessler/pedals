#!/usr/bin/env node

const HID = require('node-hid')
const clients = [];
const JsonSocket = require('json-socket');
const mapping = {
  0x0000: {"name": "pedalup"},
  0x0200: {"name": "pedaldown", "pedal": "center"},
  0x0100: {"name": "pedaldown", "pedal": "left"},
  0x0400: {"name": "pedaldown", "pedal": "right"}
}

const pedalEvent = function(data){
  code = data.readInt16BE()
  event = mapping[code] || {}
  event.code = code
  return event
}

const notifyClients = (data) => {
  event = pedalEvent(data)
  // console.log(event.code.toString(2));
  // console.log("Notifying " + clients.length + " client(s)", event)
  clients.forEach((c) => {
    c.sendMessage(event)
  })
}

const net = require('net');

// This server listens on a Unix socket at /tmp/pedals.sock
const server = net.createServer()
server.on('connection', (c) => {
  // console.log('client connected');
  c = new JsonSocket(c);
  clients.push(c);
  c.on('close', () => {
    // console.log('client disconnected');
    clients.splice(clients.indexOf(c), 1)
  });
});
server.on('error', (err) => {
  console.error(err);
});
server.on('listening', () => {
  const pedal = new HID.HID(1523, 255)
  pedal.on("data", notifyClients)
  pedal.on("error", console.error)
});

exports.pedalServer = server;
