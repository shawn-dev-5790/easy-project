import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import {
  addAbortToRequest,
  addHeaderToRequest,
  catchGlobalError,
  pickDataFromResponse,
  removeAbortFromResponse,
} from './ApiManager.service'

class ApiManager {
  protected instance: AxiosInstance
  protected requests: Map<string, AbortController>

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    this.requests = new Map()
    this.setupInterceptors()
  }
  public setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (req) => addAbortToRequest(req, this.requests),
      null
    )
    this.instance.interceptors.request.use(
      (req) => addHeaderToRequest(req),
      null
    )
    this.instance.interceptors.response.use(
      (res) => removeAbortFromResponse(res, this.requests),
      null
    )
    this.instance.interceptors.response.use(
      (res) => pickDataFromResponse(res),
      (err) => catchGlobalError(err)
    )
  }
  public getApiInstance(): AxiosInstance {
    return this.instance
  }
}

export class ReqresInApiManager extends ApiManager {}
export class TestApiManager extends ApiManager {}
