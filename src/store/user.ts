import { defineStore } from "pinia"

import { ref } from "vue";

type Roles = 'nbadmin' | 'admin'
interface Result {
  chinaname?: string;
  name?: string;
  email?: string;
  roles?: Roles[];
  officium?:string;
  money?:number | null;
  base64?: string;
  id?:number
  qqnumber?:string
  roleListCode:string | null
  roleListName:string | null
}
export const useUserStore = defineStore('User', () => {
  // 定义 state
  const userInfo = ref<Result>({
    chinaname: "",
    name: "",
    email: "",
    roles: [],
    officium:"",
    money:null,
    base64: "",
    id:undefined,
    qqnumber:null,
    roleListCode:null,
    roleListName:null
  })
  // 清空userInfo
  function clearInfo() {
    userInfo.value = {
      chinaname: "",
      name: "",
      email: "",
      roles: [],
      officium:"",
      money:null,
      base64: "",
      id:undefined,
      qqnumber:'',
      roleListCode:null,
      roleListName:null
    };
  };
  // 定义 action
  function setAllUserInfos(result: Result) {
    userInfo.value = {
      ...userInfo.value,
      ...result
    }
  };
  function updateFiled(prop:keyof Result,value:any){
    userInfo.value = {
      ...userInfo.value,
      [prop]:value
    }
  };
  return {
    userInfo,
    setAllUserInfos,
    updateFiled,
    clearInfo
  }
},
  { persist: true }
)
