// config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console() // Use console transport only
  ]
});

module.exports = logger;
