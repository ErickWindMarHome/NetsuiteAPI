import { Controller, Post, Body, Put } from "@nestjs/common"
import { SalesOrderService } from "./sales-order.service"
import { CreateSalesOrderDto } from "./dto/create-sales-order.dto"
import { UpdateSalesOrderDto } from "./dto/update-sales-order.dto"

@Controller("sales-order")
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @Post()
  create(@Body() createSalesOrderDto: CreateSalesOrderDto) {
    const salesOrderDataNS = {
      entity: createSalesOrderDto.customerId,
      item: {
        items: [
          {
            item: "552",
            amount: createSalesOrderDto.amount
          }
        ]
      },
      orderStatus: "A",
      custbody_issystemsizeset: true
    }

    return this.salesOrderService.create(salesOrderDataNS)
  }

  @Put()
  update(@Body() updateSalesOrderDto: UpdateSalesOrderDto) {
    const salesOrderDataNS = {
      entity: updateSalesOrderDto.customerId,
      tranid: updateSalesOrderDto.solarCaseNumber,
      shipdate: updateSalesOrderDto.installationStartDate,
      custbody_installationcompleteddate: updateSalesOrderDto.installationCompletedDate,
      custbody_roofingsealingscheduleddate: updateSalesOrderDto.roofingStartDate,
      custbody_roofingsealingcompleteddate: updateSalesOrderDto.roofingCompletedDate,
      custbody_wa_panel_qty: updateSalesOrderDto.panelQTY,
      custbody_wa_sunnova_id: updateSalesOrderDto.sunnovaId,
      custbody_wa_sunnova_system: updateSalesOrderDto.sunnovaSystemSize,
      custbody_wa_battery_type: updateSalesOrderDto.batteryType,
      custbody_wa_battery_qty: updateSalesOrderDto.batteryQTY,
      custbody_wa_system_size: updateSalesOrderDto.systemSize,
      custbody_wa_finance_company: updateSalesOrderDto.financeCompany,
      custbody_win_net_epc: updateSalesOrderDto.amount
    }

    return this.salesOrderService.update(updateSalesOrderDto.salesOrderId, salesOrderDataNS)
  }
}
