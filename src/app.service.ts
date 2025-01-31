import { Injectable, BadGatewayException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"
import * as crypto from "crypto"
import * as OAuth from "oauth-1.0a"

@Injectable()
export class AppService {
  private readonly customerId: string
  private readonly customerSecret: string
  private readonly tokenId: string
  private readonly tokenSecret: string
  private readonly realm: string

  constructor(private readonly configService: ConfigService) {
    this.customerId = this.configService.get<string>("CUSTOMER_ID_NETSUITE")
    this.customerSecret = this.configService.get<string>("CUSTOMER_SECRET_NETSUITE")
    this.tokenId = this.configService.get<string>("TOKEN_ID_NETSUITE")
    this.tokenSecret = this.configService.get<string>("TOKEN_SECRET_NETSUITE")
    this.realm = this.configService.get<string>("REALM")
  }

  private getAuthorizationHeader(url: string, method: string) {
    const oauth = new OAuth({
      consumer: {
        key: this.customerId,
        secret: this.customerSecret
      },
      realm: this.realm,
      signature_method: "HMAC-SHA256",
      hash_function(base_string, key) {
        return crypto.createHmac("sha256", key).update(base_string).digest("base64")
      }
    })

    return oauth.toHeader(
      oauth.authorize(
        {
          url,
          method
        },
        {
          key: this.tokenId,
          secret: this.tokenSecret
        }
      )
    )
  }

  async postData(path: string, data: Record<string, any>) {
    const uri = `https://${this.realm.toLowerCase().replace("_", "-")}.suitetalk.api.netsuite.com/services/rest/record/v1/${path}`
    const method = "POST"

    delete data.zohoId
    data = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null && value !== undefined && value !== ""))

    const headers = {
      ...this.getAuthorizationHeader(uri, method),
      "Content-Type": "application/json",
      "Content-Language": "es",
      "Accept-Language": "es"
    }

    const options = {
      method,
      headers,
      data: data
    }

    console.debug("Enviando data a NetSuite (POST)", JSON.stringify(options))

    try {
      const response = await axios(uri, options)
      return {
        status: response.status,
        message: "Registro exitoso",
        data: data
      }
    } catch (e) {
      throw new BadGatewayException(`Response from NetSuite API (postData): ${e?.response?.data?.["o:errorDetails"]?.[0]?.detail || "Server Error"}`)
    }
  }

  async updateData(path: string, data: Record<string, any>) {
    const uri = `https://${this.realm.toLowerCase().replace("_", "-")}.suitetalk.api.netsuite.com/services/rest/record/v1/${path}?replaceSelectedFields=false`
    const method = "PATCH"

    delete data.zohoId

    const headers = {
      ...this.getAuthorizationHeader(uri, method),
      "Content-Type": "application/json",
      "Content-Language": "es",
      "Accept-Language": "es"
    }

    const options = {
      method,
      headers,
      data: data
    }

    console.debug(`Enviando data a NetSuite (UPDATE) ${uri}`, JSON.stringify(options))

    try {
      const response = await axios(uri, options)
      return {
        status: response.status,
        message: "Actualización exitosa",
        data: data
      }
    } catch (e) {
      throw new BadGatewayException(`Response from NetSuite API (updateData): ${e?.response?.data?.["o:errorDetails"]?.[0]?.detail || "Server Error"}`)
    }
  }

  async getData(path: string, query = "") {
    const uri = `https://${this.realm.toLowerCase().replace("_", "-")}.suitetalk.api.netsuite.com/services/rest/record/v1/${path}?q=${query}`
    const method = "GET"
    const headers = {
      ...this.getAuthorizationHeader(uri, method),
      "Content-Type": "application/json",
      "Content-Language": "es",
      "Accept-Language": "es"
    }

    const options = {
      method,
      headers
    }

    console.log("URI", uri)
    console.debug("Enviando data a NetSuite (GET)", JSON.stringify(options))

    try {
      const response = await axios(uri, options)
      console.log("Response from NetSuite API (getData)", JSON.stringify(response.data))
      return response.data
    } catch (e) {
      throw new BadGatewayException(`Response from NetSuite API (getData): ${e?.response?.data?.["o:errorDetails"]?.[0]?.detail || "Server Error"}`)
    }
  }
}
