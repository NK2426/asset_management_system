
import {createLogger, format, transports} from 'winston';

const formatInfo = format.combine(
    format.timestamp({ format: "DD-MMM-YYYY HH:mm:ss" }),
    format.align(),
    format.printf(
        ({level, timestamp, message}) => `${level}: ${[timestamp]}: ${message}`
    )
)

const errorLogger = createLogger({
    format: formatInfo,
    transports: [
        new transports.File({
            format: formatInfo,
            filename: "logs/error.log",
            level: "error"
        })
    ],
})

const infoLogger = createLogger({
  format: formatInfo,
  transports: [
      new transports.File({
          filename: "logs/info.log",
          level: "info",
          format: formatInfo
      })
  ],
})

export default { infoLogger, errorLogger };