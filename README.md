# pedals

Execute CLI commands via [USB foot pedals](https://www.amazon.com/Infinity-Digital-Control-Computer--USB2/dp/B002MY6I7G/ref=sr_1_2?ie=UTF8&qid=1470634582&sr=8-2&keywords=USB+foot+pedals).

## Getting started

Run the `pedals.js` with the following options:

```sh
$ ./client.js  -h

  Usage: client [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -p, --pedal [value]    Pick a pedal. left, right, or center
    -c, --command [value]  Command you want to run
    -a, --async            Run command per pedal press
    -r, --clear-screen     Clear terminal before each run
```
