import { AxiosError } from 'axios'
import {
  ERROR_MSG_MAP, //
  ERROR_MSG_SELECTOR,
  HEADERS,
  TErrInterceptor,
  TReqInterceptor,
  TResInterceptor,
} from './ApiManager.config'

// header
export const addHeaderToRequest: TReqInterceptor = (req) => {
  req.headers.set('Accept-Language', HEADERS.ACCEPT_LANGUAGE)
  req.headers.set('Authorization', HEADERS.AUTHORIZATION)
  req.headers.set('X-Refresh-Token', HEADERS.X_REFRESH_TOKEN)
  return req
}

// aborts
export const addAbortToRequest =
  (aborts: Map<string, AbortController>): TReqInterceptor =>
  (req) => {
    const url = req.url
    if (!url) throw new Error(ERROR_MSG_MAP.NO_URL)

    if (aborts.has(url)) throw new Error(ERROR_MSG_MAP.ABORTED)

    const controller = new AbortController()
    aborts.set(url, controller)
    req.signal = controller.signal

    return req
  }

export const removeAbortFromResponse =
  (aborts: Map<string, AbortController>): TResInterceptor =>
  (res) => {
    const url = res.config.url
    if (!url) throw new Error(ERROR_MSG_MAP.NO_URL)

    if (!aborts.get(url)) throw new Error(ERROR_MSG_MAP.NOT_FOUND_ABORT)

    aborts.delete(url)

    return res
  }

// data format
export const pickDataFromResponse: TResInterceptor = (res) => {
  if (!res) throw new Error(ERROR_MSG_MAP.NO_RESPONSE)

  const data = res.data
  if (!data) throw new Error(ERROR_MSG_MAP.NO_DATA)

  return data
}

export const catchGlobalError: TErrInterceptor = (err) => {
  const error = err as AxiosError | Error
  if (error.message.includes(ERROR_MSG_SELECTOR)) {
    const resolved = {
      code: '0001',
      message: 'client handled error' + error.message,
      data: null,
    }
    return Promise.resolve(resolved)
  }

  return Promise.reject(err)
}
