import axios, { AxiosInstance } from 'axios'
import * as svc from './ApiManager.service'
import { CONFIG_BASE, CONFIG_REQRES_IN } from './ApiManager.config'

export class ApiManager {
  private instance: AxiosInstance
  private abortMap = new Map<string, AbortController>()

  constructor(instance: AxiosInstance) {
    this.instance = instance
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(svc.addAbortToRequest(this.abortMap), null)
    this.instance.interceptors.request.use(svc.addHeaderToRequest, null)
    this.instance.interceptors.response.use(svc.removeAbortFromResponse(this.abortMap), null)
    this.instance.interceptors.response.use(svc.pickDataFromResponse, svc.catchGlobalError)
  }

  public getApiInstance(): AxiosInstance {
    return this.instance
  }
}

const reqresIn = new ApiManager(axios.create(CONFIG_REQRES_IN))
const base = new ApiManager(axios.create(CONFIG_BASE))

export const api = {
  reqresIn: reqresIn.getApiInstance(),
  base: base.getApiInstance(),
}
