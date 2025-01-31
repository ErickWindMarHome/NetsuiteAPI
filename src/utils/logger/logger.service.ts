import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common"
import { Logger, createLogger, format, transports } from "winston"
import { ConfigService } from "@nestjs/config"
import "winston-daily-rotate-file"

@Injectable()
export class LoggerService implements NestLoggerService {
  private LoggerInfo: Logger
  private LoggerError: Logger
  private LoggerWarn: Logger
  private LoggerDebug: Logger
  private LoggerAll: Logger
  private requestId: string | null = null
  private readonly environment: string

  constructor(private readonly configService: ConfigService) {
    this.environment = this.configService.get<string>("ENVIRONMENT")
    this.createLoggers()
    this.overrideConsole()
  }

  setRequestId(requestId: string) {
    this.requestId = requestId
  }

  private createLoggers() {
    const textFormat = format.printf((log) => {
      const logId = this.requestId || "unknown-request-id"
      return `[${logId.split("-")[1]}] ${log.timestamp} - [${log.level}]: ${log.message}`
    })

    const textFormatFiles = format.printf((log) => {
      const logId = this.requestId || "unknown-request-id"

      return `[${logId}] ${log.timestamp} - [${log.level}]: ${log.message}`
    })

    const dateFormatted = format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    })

    const createDailyRotateLogger = (level: string, filename: string) =>
      createLogger({
        level,
        format: format.combine(dateFormatted, textFormatFiles),
        transports: [
          new transports.DailyRotateFile({
            filename: `./logs/${filename}/${filename}-%DATE%.log`,
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d"
          })
        ]
      })

    this.LoggerInfo = createDailyRotateLogger("info", "info")
    this.LoggerError = createDailyRotateLogger("error", "error")
    this.LoggerWarn = createDailyRotateLogger("warn", "warn")
    this.LoggerDebug = createDailyRotateLogger("debug", "debug")

    this.LoggerAll = createLogger({
      level: this.environment !== "PRODUCTION" ? "debug" : "info",
      format: format.combine(format.colorize({ all: true }), dateFormatted, textFormat),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          level: "debug",
          format: format.uncolorize(),
          filename: `./logs/all/all-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d"
        })
      ]
    })
  }

  log(message: any) {
    this.debug(message)
  }

  error(message: string, trace?: string) {
    const formattedMessage = trace ? `${message} - Stack: ${trace}` : message
    this.LoggerError.error(formattedMessage)
    this.LoggerAll.error(message)
  }

  warn(message: string) {
    this.LoggerWarn.warn(message)
    this.LoggerAll.warn(message)
  }

  debug(message: string) {
    this.LoggerDebug.debug(message)
    this.LoggerAll.debug(message)
  }

  verbose(message: string) {
    this.LoggerDebug.debug(message)
    this.LoggerAll.verbose(message)
  }

  info(message: string) {
    this.LoggerInfo.info(message)
    this.LoggerAll.info(message)
  }

  private overrideConsole() {
    console.log = (...args: any[]) => {
      this.log(args.join(" "))
    }

    console.error = (...args: any[]) => {
      this.error(args.join(" "))
    }

    console.warn = (...args: any[]) => {
      this.warn(args.join(" "))
    }

    console.debug = (...args: any[]) => {
      this.debug(args.join(" "))
    }

    console.log = (...args: any[]) => {
      this.log(args.join(" "))
    }
  }
}
