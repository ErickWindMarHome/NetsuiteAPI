import { Module } from "@nestjs/common"
import { SalesOrderService } from "./sales-order.service"
import { SalesOrderController } from "./sales-order.controller"
import { AppService } from "src/app.service"

@Module({
  controllers: [SalesOrderController],
  providers: [SalesOrderService, AppService],
  exports: [SalesOrderService]
})
export class SalesOrderModule {}
