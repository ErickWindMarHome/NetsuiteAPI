import { CreateCustomerDto } from "./create-customer.dto"
import { PartialType } from "@nestjs/swagger"

import { IsNotEmpty, IsNumber } from "class-validator"
import { Transform } from "class-transformer"

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  customerId: number
}
