import { BadGatewayException, BadRequestException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import axios from "axios"

@Injectable()
export class ZohoCrmService {
  private readonly URL_ZOHO_API_V2: string
  private readonly URL_ZOHO_API_V6: string
  private readonly CLIENT_ID: string
  private readonly CLIENT_SECRET: string
  private readonly REFRESH_TOKEN: string
  private TOKEN: string
  private tokenExpirationTime: number

  constructor(private readonly configService: ConfigService) {
    this.URL_ZOHO_API_V2 = this.configService.get<string>("URL_ZOHO_API_V2")
    this.URL_ZOHO_API_V6 = this.configService.get<string>("URL_ZOHO_API_V6")
    this.CLIENT_ID = this.configService.get<string>("CLIENT_ID_PR")
    this.CLIENT_SECRET = this.configService.get<string>("CLIENT_SECRET_PR")
    this.REFRESH_TOKEN = this.configService.get<string>("REFRESH_TOKEN_PR")
    this.tokenExpirationTime = 0
    this.getToken()
  }

  private async getToken() {
    const currentTime = Date.now()

    if (this.TOKEN && currentTime < this.tokenExpirationTime) {
      console.log("Token is still valid", this.TOKEN)
      return this.TOKEN
    }
    this.TOKEN = await this.fetchToken()
    console.log("this the token", this.TOKEN)
  }

  private async fetchToken() {
    const params = new URLSearchParams()
    params.append("client_id", this.CLIENT_ID)
    params.append("client_secret", this.CLIENT_SECRET)
    params.append("refresh_token", this.REFRESH_TOKEN)
    params.append("grant_type", "refresh_token")

    try {
      const response = await axios.post("https://accounts.zoho.com/oauth/v2/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })

      this.tokenExpirationTime = Date.now() + 30 * 60 * 1000
      return response.data.access_token
    } catch (error) {
      throw new BadGatewayException(`Error fetching Zoho token: ${error.message}`)
    }
  }

  async getData(module: string, query: string = ""): Promise<any> {
    const token = await this.getToken()
    const queryFields = query ? `?${query}` : ""

    try {
      const response = await axios.get(`${this.URL_ZOHO_API_V2}/${module}${queryFields}`, {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`
        }
      })
      return response.data.data
    } catch (error) {
      throw new BadGatewayException(`Response since Zoho API: ${error?.message} ${JSON.stringify(error?.response?.data)}`)
    }
  }

  async postData(module: string, data: object, trigger = ["approval", "workflow", "blueprint"]): Promise<any> {
    const token = await this.getToken()

    const tmpData = {
      data: [data],
      trigger
    }

    try {
      const response = await axios.post(`${this.URL_ZOHO_API_V2}/${module}`, JSON.stringify(tmpData), {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json"
        }
      })
      return response.data.data
    } catch (error) {
      throw new BadGatewayException(`Response since Zoho API: ${error?.message} ${JSON.stringify(error?.response?.data)}`)
    }
  }

  async putData(module: string, data: object, trigger = ["approval", "workflow", "blueprint"]): Promise<any> {
    const token = await this.getToken()

    const tmpData = {
      data: [data],
      trigger
    }

    try {
      const response = await axios.put(`${this.URL_ZOHO_API_V6}/${module}`, JSON.stringify(tmpData), {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json"
        }
      })
      return response.data.data
    } catch (error) {
      throw new BadGatewayException(`Response since Zoho API: ${error?.message} ${JSON.stringify(error?.response?.data)}`)
    }
  }

  async postCOQLQuery(query: { select_query: string }): Promise<any> {
    const token = await this.getToken()

    try {
      const response = await axios.post(`${this.URL_ZOHO_API_V6}/coql`, query, {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json"
        }
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 400) {
        throw new BadRequestException(`Response since Zoho API: ${error?.message} ${JSON.stringify(error?.response?.data)}`)
      } else {
        throw new BadGatewayException(`Response since Zoho API: ${error?.message} ${JSON.stringify(error?.response?.data)}`)
      }
    }
  }
}
