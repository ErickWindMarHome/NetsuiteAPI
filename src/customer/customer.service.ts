import { Injectable } from "@nestjs/common"
import { AppService } from "src/app.service"
import { ZohoCrmService } from "src/zoho-crm/zoho-crm.service"

@Injectable()
export class CustomerService {
  constructor(
    private readonly netsuiteService: AppService,
    private readonly zohoService: ZohoCrmService
  ) {}

  async create(Customer: object) {
    const zohoId = Customer["zohoId"]
    await this.netsuiteService.postData("customer", Customer)
    const customerId = await this.findOne(Customer["firstName"], Customer["lastName"])

    const salesOrderData = {
      entity: customerId,
      item: {
        items: [
          {
            item: "552",
            amount: Customer["amount"]
          }
        ]
      },
      orderStatus: "A",
      custbody_issystemsizeset: true
    }

    await this.netsuiteService.postData("salesOrder", salesOrderData)
    const resultSalesOrder = await this.netsuiteService.getData("salesorder", `entity EQUAL ${customerId}`)
    const salesOrderId = resultSalesOrder.items[resultSalesOrder.items.length - 1].id

    const zohoData = {
      id: zohoId,
      NetSuite_Customer: customerId,
      NetSuite_Sales_Order: salesOrderId
    }
    const data = await this.zohoService.putData("Deals", zohoData)

    return {
      message: "Customer created successfully",
      data: {
        zohoId: Customer["zohoId"],
        customerId: customerId,
        salesOrderId: salesOrderId,
        zohoData: data
      }
    }
  }

  private async findOne(firstName: string, lastName: string) {
    const resultCustomer = await this.netsuiteService.getData("customer", `firstName IS "${firstName}" AND lastName IS "${lastName}"`)
    return resultCustomer.items[resultCustomer.items.length - 1].id
  }

  async update(CustomerID: number, Customer: object) {
    return await this.netsuiteService.updateData(`customer/${CustomerID}`, Customer)
  }
}
