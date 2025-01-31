import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common"
import { Request, Response, NextFunction } from "express"

@Injectable()
export class AuthHeaderMiddleware implements NestMiddleware {
  private readonly requiredHeaderKey = "x-api-key"
  private readonly requiredHeaderValue = "your-secret-key"

  use(req: Request, res: Response, next: NextFunction): void {
    const headerValue = req.headers[this.requiredHeaderKey]

    if (!headerValue || headerValue !== this.requiredHeaderValue) {
      throw new UnauthorizedException("Invalid or missing API key")
    }

    next()
  }
}
