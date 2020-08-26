require('dotenv').config()

const { createLogger, format, transports } = require('winston')

const config = require('../config')[process.env.NODE_ENV || 'development']

// https://github.com/winstonjs/winston#logging
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const level = config.logLevel || 'debug'

function formatParams(info) {
   const {
      // eslint-disable-next-line no-shadow
      timestamp,
      level: Level,
      message,
      ...args
   } = info
   const ts = timestamp.slice(0, 19).replace('T', ' ')

   return `${ts} ${Level}: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, '', '') : ''
   }`
}

// https://github.com/winstonjs/winston/issues/1135
const developmentFormat = format.combine(
   format.colorize(),
   format.timestamp(),
   format.align(),
   format.printf(formatParams),
)

const productionFormat = format.combine(
   format.timestamp(),
   format.align(),
   format.printf(formatParams),
)

let logger

if (config.nodeEnv === 'development') {
   logger = createLogger({
      level,
      format: developmentFormat,
      transports: [new transports.Console()],
   })
} else if (config.nodeEnv === 'production') {
   logger = createLogger({
      level,
      format: productionFormat,
      transports: [
         new transports.File({
            filename: './logs/error.log',
            level: 'error',
         }),
         new transports.File({
            filename: './logs/combined.log',
         }),
      ],
   })

   logger.stream = {
      write(message) {
         logger.info(message)
      },
   }
} else {
   logger = createLogger({
      silent: true,
   })
}

module.exports = logger
