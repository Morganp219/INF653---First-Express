const {format} = require("date-fns")
const {v4: uuid} = require("uuid")
const fs = require('fs');
const path = require('path');


function logEvents(message) {
    const logId = uuid();
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `${logId} \t [${timestamp}] \t ${message}\n`;

    try{
  if(!fs.existsSync(path.join(__dirname, 'logs'))){
    fs.mkdirSync(path.join(__dirname, 'logs'));
  }
    fs.promises.appendFile(path.join(__dirname, 'logs', 'eventLogs.txt'), logEntry);
    } catch(err){
        console.error('Error writing to log file: ', err);
    }
}

function logMW(req, res, next) {
    logEvents(`${req.method} request to ${req.url}`);
    console.log(`${req.method} request to ${req.url}`)
    next();
}

module.exports = {logEvents, logMW};