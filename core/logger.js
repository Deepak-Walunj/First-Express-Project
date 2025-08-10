const pino = require('./pino')
const { LOG_LEVEL, LOG_FORMAT, ENABLE_CONSOLE_LOGGING, ENABLE_FILE_LOGGING, LOG_FILE_PATH } = require('./settings');
const fs = require('fs');


let transport;

if (LOG_FORMAT === 'json') {
transport = ENABLE_FILE_LOGGING
    ? pino.transport({
        targets: [
        {
            target: 'pino/file',
            options: { destination: LOG_FILE_PATH },
            level: LOG_LEVEL,
        },
        ],
    })
    : undefined;
} else {
// Pretty print console logs
    transport = pino.transport({
    target: 'pino-pretty',
    options: { colorize: true },
});
}

const logger = pino(
    {level:LOG_LEVEL},
    transport || process.stdout
)

function getLogger(name) {
  return logger.child({ name });
}

module.exports = getLogger;