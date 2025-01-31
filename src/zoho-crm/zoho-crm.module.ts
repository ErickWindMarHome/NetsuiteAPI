import { Module, Global } from "@nestjs/common"
import { ZohoCrmService } from "./zoho-crm.service"

@Global()
@Module({
  providers: [ZohoCrmService],
  exports: [ZohoCrmService]
})
export class ZohoCrmModule {}
