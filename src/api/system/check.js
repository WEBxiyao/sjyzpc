import request from '@/utils/request'

// 查询审核列表
export function listCheck(query) {
  return request({
    url: '/system/check/list',
    method: 'get',
    params: query
  })
}

// 查询审核详细
export function getCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'get'
  })
}

// 新增审核
export function addCheck(data) {
  return request({
    url: '/system/check',
    method: 'post',
    data: data
  })
}

// 修改审核
export function updateCheck(data) {
  return request({
    url: '/system/check',
    method: 'put',
    data: data
  })
}

// 删除审核
export function delCheck(id) {
  return request({
    url: '/system/check/' + id,
    method: 'delete'
  })
}

// 导出审核
export function exportCheck(query) {
  return request({
    url: '/system/check/export',
    method: 'get',
    params: query
  })
}
// 预览
export function previewCheck(id) {
  return request({
    url: '/system/quest/getQuestInfo?id='+id,
    method: 'get'
  })
}
