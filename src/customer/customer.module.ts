import { Module } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CustomerController } from "./customer.controller"
import { AppService } from "src/app.service"

@Module({
  controllers: [CustomerController],
  providers: [CustomerService, AppService],
  exports: [CustomerService]
})
export class CustomerModule {}
