import { IsString, IsNotEmpty, IsNumber } from "class-validator"
import { Transform } from "class-transformer"

export class CreateSalesOrderDto {
  @IsString()
  @IsNotEmpty()
  zohoId: string

  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  customerId: number

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  amount: number
}
