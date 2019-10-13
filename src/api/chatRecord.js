import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/list',
    method: 'get',
    params
  })
}
