#!/usr/bin/env node
require('shelljs/global')

var HID = require('node-hid')
var devices = HID.devices()
var pedal = new HID.HID(1523, 255)
var mapping = {
  0x0000: {"name": "pedalup"},
  0x0200: {"name": "pedaldown", "pedal": "center"},
  0x0100: {"name": "pedaldown", "pedal": "left"},
  0x0400: {"name": "pedaldown", "pedal": "right"}
}

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --pedal [value]', 'Pick a pedal. left, right, or center')
  .option('-c, --command [value]', 'Command you want to run')
  .parse(process.argv);

var ready = true;

var dispatch = function(data){
  code = data.readInt16BE()
  event = mapping[code] || {}
  event.code = code

  if(ready && event.name === "pedaldown"){
    if(event.pedal === program.pedal){
      ready = false
      console.log("== " + event.pedal + " pedal pressed, running " + program.command);
      proc = sh(program.command)
      proc.on("close", () => { ready = true })

    }
  }
}

const exec = require('child_process').exec;

var sh = function(cmd, callback){
  const proc = exec(cmd);
  proc.stdout.on('data', console.log);
  proc.stderr.on('data', console.error);
  proc.on('close', (code) => {
    console.log(`== process exited with code ${code}`);
  });
  return proc;
}

console.log("Listening for " + program.pedal + " pedal press to run " + program.command);

pedal.on("data", dispatch)
pedal.on("error", console.log)
