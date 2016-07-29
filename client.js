const net = require('net');
const socket = '/tmp/pedals.sock';
const JsonSocket = require('json-socket');
const client = new JsonSocket(new net.Socket());

client.connect(socket);

client.on('connect', () => {
  console.log('Connected');
});
client.on('message', (data) => {
  console.log('Received: ' + JSON.stringify(data));
  dispatch(data);
});
client.on('close', () => {
  console.log('Connection closed');
});

var program = require('commander');

program
  .version('0.0.1')
  .option('-p, --pedal [value]', 'Pick a pedal. left, right, or center')
  .option('-c, --command [value]', 'Command you want to run')
  .option('-a, --async', 'Run command per pedal press')
  .parse(process.argv);

var ready = true;

var dispatch = function(event){
  if(ready && event.name === "pedaldown"){
    if(event.pedal === program.pedal){
      if(!program.async) { ready = false }
      if(ready){
        console.log("== " + event.pedal + " pedal pressed, running " + program.command);
        proc = sh(program.command)
        proc.on("close", () => { ready = true })
      } else {
        console.log("Not ready, skipping")
      }
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

