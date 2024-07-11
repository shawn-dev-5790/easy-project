import { addHeaderToRequest, addAbortToRequest, removeAbortFromResponse, pickDataFromResponse, catchGlobalError } from './ApiManager.service'
import { describe, it, expect } from 'vitest'
import { ERROR_MSG_MAP } from './ApiManager.config'
import { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { a } from 'vitest/dist/suite-IbNSsUWN.js'

const MOCKED_REQ: InternalAxiosRequestConfig = {
  url: 'https://example.com/api',
  method: 'GET',
  headers: new AxiosHeaders(),
  params: {},
  data: {},
  timeout: 5000,
}
const MOCKED_RES: AxiosResponse = {
  config: MOCKED_REQ,
  data: { key: 'value' },
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
}

/**
 * 이 테스트 코드는 API 요청을 보내기 전 요청 객체에 헤더가 올바르게 추가되었는지 확인하는 것을 목적으로 합니다.
 *
 * `addHeaderToRequest` 함수는 요청 객체에 아래의 헤더들을 추가해야 합니다:
 * - 'Accept-Language': 사용자의 언어 설정을 서버에 알리기 위함입니다.
 * - 'Authorization': 사용자 인증을 위한 토큰을 전달합니다.
 * - 'X-Refresh-Token': 토큰 갱신을 위한 리프레시 토큰을 전달합니다.
 * 이러한 헤더들의 추가는 API 요청이 올바르게 처리될 수 있도록 하는 중요한 과정입니다.
 */
describe('ApiManager.service.addHeaderToRequest', () => {
  it('요청 객체에 필요한 헤더들을 추가해야 합니다', () => {
    const req = addHeaderToRequest(MOCKED_REQ)
    // 'Accept-Language' 헤더가 정의되어 있는지 확인
    expect(req.headers.get('Accept-Language')).toBeDefined()
    // 'Authorization' 헤더가 정의되어 있는지 확인
    expect(req.headers.get('Authorization')).toBeDefined()
    // 'X-Refresh-Token' 헤더가 정의되어 있는지 확인
    expect(req.headers.get('X-Refresh-Token')).toBeDefined()
  })
})

/**
 * 이 테스트 코드는 API 요청에 중단 신호를 올바르게 추가하는지 확인하는 것을 목적으로 합니다.
 *
 * `addAbortToRequest` 함수는 요청 객체에 중단 신호를 추가해야 합니다:
 * - 요청이 중단되어야 할 경우 이를 가능하게 하는 중단 신호를 추가합니다.
 * - 이미 중단된 URL에 대해서는 요청을 거부해야 합니다.
 * 이 과정은 API 요청이 필요할 때만 수행되어야 하며, 불필요한 네트워크 트래픽을 방지하는 데 중요한 역할을 합니다.
 */
describe('ApiManager.service.addAbortToRequest', () => {
  it('요청 객체에 중단 신호를 추가해야 합니다', () => {
    const aborts = new Map<string, AbortController>()
    const req = addAbortToRequest(aborts)(MOCKED_REQ)
    // 요청 객체에 중단 신호가 정의되어 있는지 확인
    expect(req.signal).toBeDefined()
    // 해당 URL에 대한 중단 신호가 저장되었는지 확인
    expect(aborts.has(MOCKED_REQ.url!)).toBe(true)
  })

  it('요청하는 URL이 aborts 에 저장되어 있으면 요청을 보내지 않고 내부 핸들링으로 전환', async () => {
    const aborts = new Map<string, AbortController>()
    // URL에 대한 중단 신호를 설정
    aborts.set(MOCKED_REQ.url!, new AbortController())
    // 중단된 요청에 대해 함수를 실행하면 예외가 발생해야 함
    // 커리로 인하 함수 실행 후 thrown 에러를 받아서 처리
    try {
      await expect(addAbortToRequest(aborts)(MOCKED_REQ)).rejects.toThrow(ERROR_MSG_MAP.ABORTED)
    } catch (error) {
      const err = error as Error
      expect(err.message).toBe(ERROR_MSG_MAP.ABORTED)
    }
  })
})

/**
 * 이 테스트 코드는 API 응답 후 요청 객체의 중단 신호를 제거하는 기능을 검증합니다.
 *
 * `removeAbortFromResponse` 함수는 다음과 같은 작업을 수행해야 합니다:
 * - API 요청에 대한 응답이 성공적으로 반환된 후, 해당 요청의 URL을 키로 사용하여
 *   중단 신호를 저장하고 있는 Map에서 해당 요청의 중단 신호(AbortController 인스턴스)를 제거합니다.
 * - 이는 더 이상 해당 요청이 중단될 필요가 없음을 의미하며, 메모리 누수를 방지하는 데 도움이 됩니다.
 *
 * 이 테스트는 중단 신호가 올바르게 제거되었는지 확인함으로써, 함수가 기대하는 대로 작동하는지 검증합니다.
 */
describe('ApiManager.service.removeAbortFromResponse', () => {
  it('응답 후 맵에서 중단 신호를 제거해야 합니다', () => {
    const aborts = new Map<string, AbortController>()
    // URL에 대한 중단 신호를 Map에 설정합니다.
    aborts.set(MOCKED_REQ.url!, new AbortController())
    // 응답이 반환된 후, removeAbortFromResponse 함수를 호출하여 중단 신호를 제거합니다.
    removeAbortFromResponse(aborts)(MOCKED_RES)
    // 중단 신호가 제거되었는지 확인합니다.
    expect(aborts.has(MOCKED_RES.config.url!)).toBe(false)
  })
})

/**
 * `pickDataFromResponse` 함수는 API 응답 객체에서 데이터를 추출하는 기능을 검증합니다.
 *
 * 이 함수는 응답 객체에서 `data` 필드를 찾아 그 값을 반환해야 합니다.
 * 이는 API 응답의 유용한 부분만을 소비자에게 전달하기 위한 과정입니다.
 */
describe('ApiManager.service.pickDataFromResponse', () => {
  it('응답에서 데이터를 추출해야 합니다', () => {
    expect(pickDataFromResponse(MOCKED_RES)).toEqual(MOCKED_RES.data)
  })
})

/**
 * `catchGlobalError` 함수는 애플리케이션에서 발생하는 에러를 처리하는 방법을 검증합니다.
 *
 * - 알려진 에러(예: ERROR_MSG_MAP에 정의된 에러)가 발생한 경우, 이 함수는 사용자 정의 에러 객체를 반환해야 합니다.
 *   이 객체는 에러 코드, 메시지, 그리고 추가 데이터(여기서는 null)를 포함합니다.
 * - 알려지지 않은 에러가 발생한 경우, 이 함수는 해당 에러를 그대로 던져야 합니다.
 *   이는 예상치 못한 에러를 처리하고, 개발자가 문제를 식별할 수 있도록 합니다.
 */
describe('ApiManager.service.catchGlobalError', () => {
  it('알려진 에러에 대해서는 사용자 정의 에러 객체로 해결해야 합니다', async () => {
    const error = new Error(ERROR_MSG_MAP.NO_URL)
    const result = await catchGlobalError(error)
    expect(result).toEqual({
      code: '0001',
      message: 'client handled error' + error.message,
      data: null,
    })
  })

  it('알려지지 않은 에러에 대해서는 거부해야 합니다', async () => {
    const mockError = new Error('Test error without selector')
    await expect(catchGlobalError(mockError)).rejects.toEqual(mockError)
  })
})
