import Vue from "vue";
import Vuex from "vuex";
// import actions from "./actions";
// import mutations from "./mutations";
Vue.use(Vuex);

const vuex = new Vuex.Store({
  state: {
    deviceId: "",
    natureIdArr: [],
    currentOrgId: null,
    equipmentId: "",
    piImgSrc: "",
    deviceImgSrc: "",
    piData: [],
    orgAllArr: [],
  },
  // mutations,
  // actions,
});

export default vuex;
