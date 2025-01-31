import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { LoggerService } from "./utils/logger/logger.service"
import { ValidationPipe } from "@nestjs/common"
import { AllExceptionsFilter } from "./utils/all-exceptions-filter/all-exceptions-filter.filter"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = app.get(LoggerService)

  app.useLogger(logger)

  app.useGlobalFilters(new AllExceptionsFilter(logger))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  const config = new DocumentBuilder().setTitle("Financial API").setDescription("Aqui encontraras toda la documentacion de el Financial API").setVersion("0.0.2").build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("docs", app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
