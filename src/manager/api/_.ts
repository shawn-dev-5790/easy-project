import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

type TReqInterceptor = (req: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<never>
type TResInterceptor = (res: AxiosResponse) => AxiosResponse | Promise<never>
type TErrInterceptor = (err: unknown) => unknown

// constant
const HEADERS = {
  ACCEPT_LANGUAGE: 'en',
  AUTHORIZATION: 'Bearer YOUR_AUTH_TOKEN',
  X_REFRESH_TOKEN: 'YOUR_REFRESH_TOKEN',
}
// static options
const CINFIG_REQRES_IN = {
  baseURL: 'https://reqres.in/api', // domain reqres.in
  withCredentials: false, // TODO: set to true
}
const ERROR_MSG_MAP = {
  NO_URL: 'This request has no URL',
  ABORTED: 'This request has been aborted',
  NOT_FOUND_ABORT: 'This request has not been found',
}

const abortMap = new Map<string, AbortController>()

const reqHeadersInterceptor: TReqInterceptor = (req) => {
  req.headers.set('Accept-Language', HEADERS.ACCEPT_LANGUAGE)
  req.headers.set('Authorization', HEADERS.AUTHORIZATION)
  req.headers.set('X-Refresh-Token', HEADERS.X_REFRESH_TOKEN)
  return req
}

const reqAbortInterceptor: TReqInterceptor = (req) => {
  const url = req.url
  if (!url) return Promise.reject(new Error(ERROR_MSG_MAP.NO_URL))

  const abort = abortMap.get(url)
  if (abort) return Promise.reject(new Error(ERROR_MSG_MAP.ABORTED))

  const controller = new AbortController()
  // add controller to map
  abortMap.set(url, controller)

  // add signal to request
  req.signal = controller.signal

  return req
}
const resAbortInterceptor: TResInterceptor = (res: AxiosResponse) => {
  const url = res.config.url
  if (!url) return Promise.reject(new Error(ERROR_MSG_MAP.NO_URL))

  const abort = abortMap.get(url)
  if (!abort) return Promise.reject(new Error(ERROR_MSG_MAP.NOT_FOUND_ABORT))

  // remove controller from map
  abortMap.delete(url)

  return res
}

const resDataInterceptor: TResInterceptor = (res) => {
  return res.data
}

const resErrDataInterceptor: TErrInterceptor = (err) => {
  return Promise.reject(err)
}

// create instance
const instance = axios.create(CINFIG_REQRES_IN)

// set interceptors
instance.interceptors.request.use(reqAbortInterceptor, null)
instance.interceptors.request.use(reqHeadersInterceptor, null)

instance.interceptors.response.use(resAbortInterceptor, null)
instance.interceptors.response.use(resDataInterceptor, resErrDataInterceptor)

export const api = {
  reqresIn: instance,
  dtr: instance,
  base: instance,
}

// FIXME: 어스 토큰이 만료되어 에러가 발생하면, 리프레시 토큰으로 리커버리 시도
// const setRefreshHeaders = (req: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//   console.log('setRefreshHeaders2', req.headers.get('Refresh-Token'))
//   req.headers.set('Authorization', 'Bearer ' + AUTH_TOKEN + 1)
//   req.headers.set('Refresh-Token', REFRESH_TOKEN + 1)
//   return req
// }
