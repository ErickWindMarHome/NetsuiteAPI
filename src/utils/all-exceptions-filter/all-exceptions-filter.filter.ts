import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common"
import { Response } from "express"
import { LoggerService } from "../logger/logger.service"

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
    const message = exception.getResponse()
    const stack = exception.stack

    const errorLog = {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.url,
      status,
      message: message instanceof Object ? JSON.stringify(message) : message,
      stack
    }

    this.logger.error(errorLog.message, errorLog.stack)

    response.status(status).json(message)
  }
}
