import request from '@/utils/request'

// 查询素材内容列表
export function listMaterial(query) {
  return request({
    url: '/system/material/list',
    method: 'get',
    params: query
  })
}

// 查询素材内容详细
export function getMaterial(id) {
  return request({
    url: '/system/material/' + id,
    method: 'get'
  })
}

// 新增素材内容
export function addMaterial(data) {
  return request({
    url: '/system/material',
    method: 'post',
    data: data
  })
}

// 修改素材内容
export function updateMaterial(data) {
  return request({
    url: '/system/material',
    method: 'put',
    data: data
  })
}

// 删除素材内容
export function delMaterial(id) {
  return request({
    url: '/system/material/' + id,
    method: 'delete'
  })
}

// 导出素材内容
export function exportMaterial(query) {
  return request({
    url: '/system/material/export',
    method: 'get',
    params: query
  })
}

//审核
export function audit (query) {
  return request({
    url: '/system/material/audit',
    method: 'post',
    params: query
  })
}

//新增推文
export function  exporttMaterial (query) {
  return request({
    url: '/system/material/add',
    method: 'post',
    params: query
  })
}
//编辑推文
export function  materialedit (data) {
  return request({
    url: '/system/material/edit',
    method: 'post',
    data: data
  })
}
// 新增提交
export function  newsMaterialAdd (data) {
  return request({
    url: '/system/material/add',
    method: 'post',
    data: data
  })
}
