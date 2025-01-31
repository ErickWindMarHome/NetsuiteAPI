import { Injectable, NestMiddleware } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"
import { LoggerService } from "./logger.service"
import { randomUUID } from "crypto"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req
    const startTime = Date.now()

    // Generar un UUID único para esta solicitud
    const requestId = randomUUID()

    // Añadir el UUID a la solicitud
    req["requestId"] = requestId

    // Establecer el UUID en el logger
    this.logger.setRequestId(requestId)

    this.logger.debug(`${method},${url}`)

    res.on("finish", () => {
      const { statusCode } = res
      const responseTime = Date.now() - startTime
      const message = `${method},${statusCode},${url} +${responseTime}ms`

      if (statusCode >= 400) {
        this.logger.error(message)
      } else {
        this.logger.info(message)
      }
    })

    next()
  }
}
