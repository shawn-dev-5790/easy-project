import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import {
  ERROR_MSG_MAP, //
  ERROR_MSG_SELECTOR,
  HEADERS,
} from './ApiManager.config'

// header
export const addHeaderToRequest = (
  req: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  req.headers.set('Accept-Language', HEADERS.ACCEPT_LANGUAGE)
  req.headers.set('Authorization', HEADERS.AUTHORIZATION)
  req.headers.set('X-Refresh-Token', HEADERS.X_REFRESH_TOKEN)
  return req
}

// aborts
export const addAbortToRequest = (
  req: InternalAxiosRequestConfig,
  requests: Map<string, AbortController>
): InternalAxiosRequestConfig => {
  const url = req.url
  if (!url) throw new Error(ERROR_MSG_MAP.NO_URL)

  if (requests.has(url)) throw new Error(ERROR_MSG_MAP.ABORTED)

  const controller = new AbortController()
  requests.set(url, controller)
  req.signal = controller.signal

  return req
}

export const removeAbortFromResponse = (
  res: AxiosResponse,
  requests: Map<string, AbortController>
): AxiosResponse => {
  const url = res.config.url
  if (!url) throw new Error(ERROR_MSG_MAP.NO_URL)

  if (!requests.get(url)) throw new Error(ERROR_MSG_MAP.NOT_FOUND_ABORT)

  requests.delete(url)

  return res
}

// data format
export const pickDataFromResponse = (res: AxiosResponse): AxiosResponse => {
  if (!res) throw new Error(ERROR_MSG_MAP.NO_RESPONSE)

  return res
}

export const catchGlobalError = (err: unknown): unknown => {
  const error = err as AxiosError | Error
  if (error.message.includes(ERROR_MSG_SELECTOR)) {
    const resolved = {
      code: '0001',
      message: 'client handled error' + error.message,
      data: null,
    }
    return Promise.reject(resolved)
  }

  return Promise.reject(err)
}
