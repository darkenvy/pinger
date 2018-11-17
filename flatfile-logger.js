const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class FlatfileLogger {
  constructor(logPath) {
    const folderPath = logPath || path.join(__dirname, 'logs');
    fs.mkdirpSync(folderPath);
    
    this.folderPath = path.normalize(folderPath);
  }
  
  log(str) {
    const today = moment();
    const filename = today.format('Y-MM-DD');
    const prefix = today.format('X,kk:mm:ss');
    const line = `${prefix},${str}\n`;

    const filepath = path.join(this.folderPath, `${filename}.txt`)
    fs.appendFile(filepath, line, 'utf8', err => {
      if (err) console.log('error appending to file', filepath, line, err);
    });
  }
}

module.exports = FlatfileLogger;
