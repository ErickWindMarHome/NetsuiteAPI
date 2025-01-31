import { MiddlewareConsumer, Module } from "@nestjs/common"
import { AppService } from "./app.service"
import { CustomerModule } from "./customer/customer.module"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"
import { LoggerService } from "./utils/logger/logger.service"
import { LoggerMiddleware } from "./utils/logger/logger.middleware"
import { SalesOrderModule } from "./sales-order/sales-order.module"
import { ZohoCrmModule } from "./zoho-crm/zoho-crm.module"
import { AuthHeaderMiddleware } from "./utils/auth-header/auth-header.middleware"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    CustomerModule,
    SalesOrderModule,
    ZohoCrmModule
  ],
  providers: [AppService, LoggerService],
  exports: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AuthHeaderMiddleware).forRoutes("*")
  }
}
