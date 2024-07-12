import { ReqresInApiManager, TestApiManager } from './ApiManager'

const reqresIn = new ReqresInApiManager({
  baseURL: 'https://reqres.in/api',
  withCredentials: false,
  timeout: 5000,
})
const test = new TestApiManager({
  baseURL: 'https://reqres.in/api',
  timeout: 3000,
})

export const api = {
  reqresIn: reqresIn.getApiInstance(),
  test: test.getApiInstance(),
}
