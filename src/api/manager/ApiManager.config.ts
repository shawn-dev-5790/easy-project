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
