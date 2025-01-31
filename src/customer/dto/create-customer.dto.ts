import { IsString, IsOptional, IsNotEmpty, IsNumber } from "class-validator"
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

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  zohoId: string

  @Transform(({ value }) => parseFloat(value))
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsString()
  @IsNotEmpty()
  firstName: string

  @IsString()
  @IsNotEmpty()
  lastName: string

  @IsString()
  @IsOptional()
  address: string

  @IsString()
  @IsOptional()
  city: string

  @IsString()
  @IsOptional()
  zipCode: string

  @Transform(({ value }) => (value === "Commercial Solar" ? 4 : 3))
  @IsNumber()
  @IsNotEmpty()
  dealType: number

  @IsString()
  @IsOptional()
  solarCaseNumber: string | null

  @IsString()
  @IsOptional()
  sunnovaId: string

  @Transform(({ value }) => (value !== null ? FinanceCompanyMap[value.toLowerCase()] : null))
  @IsNumber()
  @IsOptional()
  financeCompany: number

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  systemSize: number

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  batteryQTY: number

  @Transform(({ value }) => (value !== null ? BateryTypeMap[value.toLowerCase()] : null))
  @IsNumber()
  @IsOptional()
  batteryType: number

  @IsString()
  @IsOptional()
  salesRepId: string

  @Transform(({ value }) => (value !== null ? parseInt(value) : null))
  @IsNumber()
  @IsOptional()
  sunnovaSystemSize: number
}
