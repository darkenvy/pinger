const shell = require('shelljs');
const flatfileLogger = require('./flatfile-logger');

class Pinger {
  static ping(url) {
    let result = null;

    const response = shell.exec(`ping -t 10 -c 1 ${url} | grep "time="`, { silent: true });
    const { code, stdout, stderr } = response;
    if (code) return 0 - code; // timeout or error

    // successful pin
    const match = stdout.match(/time=(\d+\.\d+)\s(\w{2})/);
    if (match) {
      const unit = match[2];
      let time = match[1] && parseInt(match[1]);
      if (unit === 's') time *= 1000;
      result = time;
    }

    return result;
  }

  constructor(params) {
    const { url, interval, silent } = params || {};
    this.url = url || '1.1.1.1';
    this.interval = interval || 1000;
    this.logger = new flatfileLogger();
    this.silent = silent || false;
    this.setInterval = null;
  }

  consoleLog() {
    if (this.silent) return;
    console.log(...arguments);
  }

  each() {
    const ping = this.constructor.ping(this.url);
    const text = `${this.url},${ping}`;
    this.consoleLog(`${ping}ms - ${this.url}`);
    this.logger.log(text);
  }

  start() {
    this.consoleLog(`Pinging ${this.url} at intervals of ${this.interval} seconds.`);
    const interval = parseInt(this.interval, 10) * 1000;
    this.setInterval = setInterval(this.each.bind(this), interval);
  }

  stop() {
    this.consoleLog('Stopping Interval.')
    clearInterval(this.setInterval);
    this.setInterval = null;
  }
}

module.exports = Pinger;
