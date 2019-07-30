# pedals

Execute CLI commands via [USB foot pedals](https://www.amazon.com/Infinity-Digital-Control-Computer--USB2/dp/B002MY6I7G/ref=sr_1_2?ie=UTF8&qid=1470634582&sr=8-2&keywords=USB+foot+pedals).

## Getting started

Pedals consists of two programs:

1. `server.js` which listens to the actual HID device and sends message to the `pedals.js` clients. You only need to run this once.

2. `pedals.js` is a CLI that connects to `server.js` and executes the command `-c` for the pedals `-p` from the given arguments. Here's the available arguments

```sh
$ ./pedals.js  -h

  Usage: client [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --pedal [value]    Pick a pedal. left, right, or center
    -c, --command [value]  Command you want to run
    -a, --async            Run command per pedal press
    -r, --clear-screen     Clear terminal before each run
```

## Contributing

* [] - One CLI binary that combines `server.js` and `pedals.js` so people don't have to worry about running the server, or relaunching it when it crashes.

* [] - Support other types of foot pedals; currently this lib only works with [Infinity Digital USB foot pedals](https://www.amazon.com/Infinity-Digital-Control-Computer--USB2/dp/B002MY6I7G/ref=sr_1_2?ie=UTF8&qid=1470634582&sr=8-2&keywords=USB+foot+pedals).

* [] - Installable global binary, `pedals`, and maybe packaging it up so that its a portable binary.

If you'd like to help, open a PR. Thanks!