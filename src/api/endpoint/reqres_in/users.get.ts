import { api } from '../../manager'

export const reqGetUesr = async (opts = {}) => {
  const res = await api.reqresIn.get<IResGetUsers>('/users', opts)
  return res
}

export interface IReqGetUsers {
  url?: string // https://reqres.in/api/users?page=2
  query: { page: number }
}
export interface IResGetUsers {
  page: number
  per_page: number
  total: number
  total_pages: number
  data: IUser[]
  support: ISupport
}

interface IUser {
  id: number
  email: string
  first_name: string
  last_name: string
  avatar: string
}

interface ISupport {
  url: string
  text: string
}
