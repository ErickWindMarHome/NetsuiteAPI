import { CreateSalesOrderDto } from "./create-sales-order.dto"
import { PartialType } from "@nestjs/swagger"

import { IsString, IsOptional, IsNumber, IsDateString, IsNotEmpty } from "class-validator"
import { Transform } from "class-transformer"

const BateryTypeMap = {
  none: 3,
  "tesla añadida (gtwy existente)": 5,
  tesla: 4,
  deka: 1,
  lg: 2,
  enphase: 6
}

const FinanceCompanyMap = {
  cash: 1,
  sunnova: 2,
  oriental: 3,
  cdbg: 4
}

export class UpdateSalesOrderDto extends PartialType(CreateSalesOrderDto) {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber()
  salesOrderId: number

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  customerId?: number

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional()
  amount?: number

  @IsString()
  @IsOptional()
  solarCaseNumber: string | null

  @IsString()
  @IsOptional()
  brigada: string

  @IsDateString()
  @IsOptional()
  installationStartDate: Date

  @IsDateString()
  @IsOptional()
  installationCompletedDate: Date

  @IsDateString()
  @IsOptional()
  roofingStartDate: Date

  @IsDateString()
  @IsOptional()
  roofingCompletedDate: Date

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  panelQTY: number

  @IsString()
  @IsOptional()
  sunnovaId: string

  @Transform(({ value }) => (value !== null ? FinanceCompanyMap[value.toLowerCase()] : null))
  @IsNumber()
  @IsOptional()
  financeCompany: number

  @Transform(({ value }) => (value !== null ? BateryTypeMap[value.toLowerCase()] : null))
  @IsNumber()
  @IsOptional()
  batteryType: number

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  batteryQTY: number

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  systemSize: number

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  sunnovaSystemSize: number
}
