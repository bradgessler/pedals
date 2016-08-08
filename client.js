#!/usr/bin/env node

const net = require('net');
const socket = '/tmp/pedals.sock';
const JsonSocket = require('json-socket');
const client = new JsonSocket(new net.Socket());
const fs = require('fs');
const pedalServer = require("./server.js").pedalServer

client.on('connect', () => {
  console.log('Connected');
});
client.on('message', (data) => {
  // console.log('Received: ' + JSON.stringify(data));
  dispatch(data);
});
client.on('close', () => {
  // console.log('Connection closed');
});
client.on('error', (err) => {
  console.log("Starting pedal server");
  fs.unlink(socket, (err) => {
    // Ignore this if the socket doesn't exist.
    if(err && err.code != "ENOENT"){
      console.error(err)
    }
  });
  pedalServer.listen(socket);
  pedalServer.on("listening", () => {
    client.connect(socket);
  })
});

client.connect(socket);

const program = require('commander');

program
  .version('0.0.1')
  .option('-p, --pedal [value]', 'Pick a pedal. left, right, or center')
  .option('-c, --command [value]', 'Command you want to run')
  .option('-a, --async', 'Run command per pedal press')
  .option('-r, --clear-screen', 'Clear terminal before each run')
  .parse(process.argv);

const pedal = program.pedal || false;
const sync = !(program.async || false);
const command = program.command;
const clearScreen = program.clearScreen;
var ready = true;

const dispatch = function(event){
  if(ready && event.name === "pedaldown"){
    if(event.pedal === pedal || pedal === false){
      if(ready){
        if(sync) { ready = false }
        if(clearScreen) { process.stdout.write('\x1B[2J\x1B[0f'); }
        console.log("== " + event.pedal + " pedal pressed, running " + command);
        proc = sh(command)
        proc.on("close", () => { ready = true })
      } else {
        console.log("Not ready, skipping")
      }
    }
  }
}

const exec = require('child_process').exec;

const sh = function(cmd, callback){
  const proc = exec(cmd);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
  proc.stdin.pipe(process.stdin);
  proc.on('close', (code) => {
    proc.stdout.unpipe(process.stdout);
    proc.stderr.unpipe(process.stderr);
    proc.stdin.unpipe(process.stdin);
    if(code !== 0){
      console.log(`!! process exited with code ${code}`);
    }
  });
  return proc;
}

console.log("Listening for " + pedal + " pedal press to run " + command);

