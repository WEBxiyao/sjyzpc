import request from '@/utils/request'

// 查询问卷调查题目列表
export function listSubject(query) {
  return request({
    url: '/system/subject/list',
    method: 'get',
    params: query
  })
}

// 查询问卷调查题目详细
export function getSubject(id) {
  return request({
    url: '/system/subject/' + id,
    method: 'get'
  })
}

// 新增问卷调查题目
export function addSubject(data) {
  return request({
    url: '/system/subject',
    method: 'post',
    data: data
  })
}

// 修改问卷调查题目
export function updateSubject(data) {
  return request({
    url: '/system/subject',
    method: 'put',
    data: data
  })
}

// 删除问卷调查题目
export function delSubject(id) {
  return request({
    url: '/system/subject/' + id,
    method: 'delete'
  })
}

// 导出问卷调查题目
export function exportSubject(query) {
  return request({
    url: '/system/subject/export',
    method: 'get',
    params: query
  })
}
// 新增问卷
export function unionQuestID(data) {
  return request({
    url: '/system/subject/unionQuestID',
    method: 'post',
    data: data
  })
}

//通过问卷id获取题目和选项
export function getQuestInfo(query) {
  return request({
    url: '/system/quest/getQuestInfo',
    method: 'get',
    params: query
  })
}
//---------------------------------------------------------------
//通过题目id获取选项
export function getSubjectInfo(query) {
  return request({
    url: '/system/subject/getSubjectInfo',
    method: 'get',
    params: query
  })
}

// 查询调查问卷选项列表
export function listOption(query) {
  return request({
    url: '/system/option/list',
    method: 'get',
    params: query
  })
}

// 查询调查问卷选项详细
export function getOption(id) {
  return request({
    url: '/system/option/' + id,
    method: 'get'
  })
}

// 新增调查问卷选项
export function addOption(data) {
  return request({
    url: '/system/option',
    method: 'post',
    data: data
  })
}

// 修改调查问卷选项
export function updateOption(data) {
  return request({
    url: '/system/option',
    method: 'put',
    data: data
  })
}

// 删除调查问卷选项
export function delOption(id) {
  return request({
    url: '/system/option/' + id,
    method: 'delete'
  })
}

// 导出调查问卷选项
export function exportOption(query) {
  return request({
    url: '/system/option/export',
    method: 'get',
    params: query
  })
}