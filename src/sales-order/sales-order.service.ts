import { Injectable } from "@nestjs/common"
import { AppService } from "src/app.service"
import { ZohoCrmService } from "src/zoho-crm/zoho-crm.service"

@Injectable()
export class SalesOrderService {
  constructor(
    private readonly netsuiteService: AppService,
    private readonly zohoService: ZohoCrmService
  ) {}

  async create(salesOrder: object) {
    await this.netsuiteService.postData("salesOrder", salesOrder)
    const salesOrderId = await this.findOne(salesOrder["entity"])

    return {
      message: "Sales order created successfully",
      data: {
        zohoId: salesOrder["zohoId"],
        salesOrderId: salesOrderId
      }
    }
  }

  private async findOne(customerId: number) {
    const resultSalesOrder = await this.netsuiteService.getData("salesorder", `entity EQUAL ${customerId}`)
    return resultSalesOrder.items[resultSalesOrder.items.length - 1].id
  }

  async update(SalesOrderId: number, SalesOrder: object) {
    return await this.netsuiteService.updateData(`salesorder/${SalesOrderId}`, SalesOrder)
  }
}
