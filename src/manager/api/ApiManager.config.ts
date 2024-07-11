import { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * 요청 인터셉터 타입 정의.
 * @param req - Axios 요청 설정.
 * @returns 수정된 요청 설정 또는 에러 타입.
 */
export type TReqInterceptor = (req: InternalAxiosRequestConfig) => InternalAxiosRequestConfig 

/**
 * 응답 인터셉터 타입 정의.
 * @param res - Axios 응답 객체.
 * @returns 수정된 응답 객체 또는 에러 타입.
 */
export type TResInterceptor = (res: AxiosResponse) => AxiosResponse 

/**
 * 오류 인터셉터 타입 정의.
 * @param err - 발생한 오류 객체.
 * @returns 처리된 오류 객체.
 */
export type TErrInterceptor = (err: unknown) => unknown

/**
 * 공통 HTTP 헤더 설정.
 */
export const HEADERS = {
  ACCEPT_LANGUAGE: 'en', // 요청 언어 설정.
  AUTHORIZATION: 'Bearer YOUR_AUTH_TOKEN', // 인증 토큰.
  X_REFRESH_TOKEN: 'YOUR_REFRESH_TOKEN', // 리프레시 토큰.
}

/**
 * 오류 메시지 선택자.
 */
export const ERROR_MSG_SELECTOR = '@:'
/**
 * 오류 메시지 매핑.
 */
export const ERROR_MSG_MAP = {
  NO_URL: ERROR_MSG_SELECTOR + 'This request has no URL', // URL 없음 오류 메시지.
  ABORTED: ERROR_MSG_SELECTOR + 'This request has been aborted', // 요청 중단 오류 메시지.
  NOT_FOUND_ABORT: ERROR_MSG_SELECTOR + 'This request has not been found', // 요청 찾지 못함 오류 메시지.
  NO_RESPONSE: ERROR_MSG_SELECTOR + 'No response', // 응답 없음 오류 메시지.
  NO_DATA: ERROR_MSG_SELECTOR + 'No data', // 데이터 없음 오류 메시지.
}

/**
 * reqres.in을 위한 Axios 인스턴스 설정.
 * @constant
 * @type {Object}
 * @property {string} baseURL - reqres.in 도메인.
 * @property {boolean} withCredentials - 크로스 사이트 요청 시 인증 정보를 포함할지 여부.
 */
export const CONFIG_REQRES_IN = {
  baseURL: 'https://reqres.in/api', // 기본 요청 URL.
  withCredentials: false, // 인증 정보 포함 설정. TODO: 필요에 따라 true로 설정.
}

/**
 * 서비스 기본 도메인을 위한 Axios 인스턴스 설정.
 * @constant
 * @type {Object}
 * @property {string} baseURL - reqres.in 도메인.
 * @property {boolean} withCredentials - 크로스 사이트 요청 시 인증 정보를 포함할지 여부.
 */
export const CONFIG_BASE = {
  baseURL: 'https://reqres.in/api', // 기본 요청 URL.
}
