import request from '@/utils/request'

// 查询问卷调查基础列表
export function listQuest(query) {
  return request({
    url: '/system/quest/list',
    method: 'get',
    params: query
  })
}

// 查询问卷调查基础详细
export function getQuest(id) {
  return request({
    url: '/system/quest/' + id,
    method: 'get'
  })
}
// 统计
export function getStatistical(id) {
  return request({
    url: '/system/quest/statisticalQuest?questId=' + id,
    method: 'get'
  })
}
// 新增问卷调查基础
export function addQuest(data) {
  return request({
    url: '/system/quest',
    method: 'post',
    data: data
  })
}

// 修改问卷调查基础
export function updateQuest(data) {
  return request({
    url: '/system/quest',
    method: 'put',
    data: data
  })
}

// 删除问卷调查基础
export function delQuest(id) {
  return request({
    url: '/system/quest/' + id,
    method: 'delete'
  })
}

// 导出问卷调查基础
export function exportQuest(query) {
  return request({
    url: '/system/quest/export',
    method: 'get',
    params: query
  })
}
