import request from '@/utils/request'

// 查询推文列表
export function listPushnews(query) {
  return request({
    url: '/system/tweet/list',
    method: 'get',
    params: query
  })
}
// 推文类型
export function typesTweets(query) {
  return request({
    url: '/system/dict/data/dictType/tweet_type',
    method: 'get',
    params: query
  })
}
// 查询推文详细
export function getPushnews(id) {
  return request({
    url: '/system/tweet/' + id,
    method: 'get'
  })
}

// 新增推文
export function addPushnews(data) {
  return request({
    url: '/system/tweet/add',
    method: 'post',
    data: data
  })
}

// 修改推文
export function updatePushnews(data) {
  return request({
    url: '/system/tweet',
    method: 'put',
    data: data
  })
}

// 删除推文
export function delPushnews(id) {
  return request({
    url: '/system/tweet/' + id,
    method: 'delete'
  })
}

// 导出推文
export function exportPushnews(query) {
  return request({
    url: '/system/tweet/export',
    method: 'get',
    params: query
  })
}
// 审核
export function exportaudit(query) {
  return request({
    url: '/system/tweet/audit',
    method: 'post',
    params: query
  })
}
