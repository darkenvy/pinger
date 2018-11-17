const yargs = require('yargs')
const Pinger = require('./pinger');

yargs.usage(`Arguments are optional
--interval seconds [-i seconds]
--target url [-t url]
--silent [-s]

Usage:
  $0 --interval 10 --target google.com
  $0 --i 10 --target google.com
`);

const argv = yargs.argv;
const { interval, i, target, t, silent, s } = argv;
const pinger = new Pinger({
  url: target || t,
  interval: interval || i,
  silent: silent || s,
});

pinger.start();
