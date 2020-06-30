// import Cookies from 'js-cookie'

const state = {
  materialData:{}
}

const mutations = {
  SET_MATERIALDATA: (state,materialData) =>{
    state.materialData = materialData
  }
}

const actions = {
  setMaterialData({commit}, materialData){
      console.log("commit",commit,"stor",materialData)
    commit('SET_MATERIALDATA', materialData)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
