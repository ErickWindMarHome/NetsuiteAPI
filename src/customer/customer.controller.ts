import { Controller, Post, Body, Put } from "@nestjs/common"
import { CustomerService } from "./customer.service"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"

@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  createOther(@Body() createCustomerDto: CreateCustomerDto) {
    const customerDataNS = {
      zohoId: createCustomerDto.zohoId,
      entityId: `${createCustomerDto.solarCaseNumber || ""} ${createCustomerDto.firstName} ${createCustomerDto.lastName}`,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      subsidiary: createCustomerDto.dealType,
      custentity_wa_case_number: createCustomerDto.solarCaseNumber,
      custentity_winsunovaid: createCustomerDto.sunnovaId,
      custentity_winepcamt: createCustomerDto.amount,
      custentity_win_sunnova_netepc: createCustomerDto.amount,
      custentity_wa_finance_company: createCustomerDto.financeCompany,
      custentity_win_system_size: createCustomerDto.systemSize,
      custentity_win_battery_qty: createCustomerDto.batteryQTY,
      custentity_win_battery_type: createCustomerDto.batteryType,
      custentity_windmar_sales_rep: createCustomerDto.salesRepId,
      amount: createCustomerDto.amount,
      addressBook: {
        items: [
          {
            addressBookAddress: {
              addr1: createCustomerDto.address,
              city: createCustomerDto.city,
              zip: createCustomerDto.zipCode
            }
          }
        ]
      }
    }

    return this.customerService.create(customerDataNS)
  }

  @Put()
  update(@Body() updateCustomerDto: UpdateCustomerDto) {
    const customerDataNS = {
      zohoId: updateCustomerDto.zohoId,
      entityId: `${updateCustomerDto.solarCaseNumber || ""} ${updateCustomerDto.firstName} ${updateCustomerDto.lastName}`,
      firstName: updateCustomerDto.firstName,
      lastName: updateCustomerDto.lastName,
      subsidiary: updateCustomerDto.dealType,
      custentity_wa_case_number: updateCustomerDto.solarCaseNumber,
      custentity_winsunovaid: updateCustomerDto.sunnovaId,
      custentity_winepcamt: updateCustomerDto.amount,
      custentity_win_sunnova_netepc: updateCustomerDto.amount,
      custentity_wa_finance_company: updateCustomerDto.financeCompany,
      custentity_win_system_size: updateCustomerDto.systemSize,
      custentity_win_battery_qty: updateCustomerDto.batteryQTY,
      custentity_win_battery_type: updateCustomerDto.batteryType,
      custentity_windmar_sales_rep: updateCustomerDto.salesRepId,
      addressBook: {
        items: [
          {
            addressBookAddress: {
              addr1: updateCustomerDto.address,
              city: updateCustomerDto.city,
              zip: updateCustomerDto.zipCode
            }
          }
        ]
      }
    }

    return this.customerService.update(updateCustomerDto.customerId, customerDataNS)
  }
}
