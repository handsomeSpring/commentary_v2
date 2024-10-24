import request from "@/utils/request"

// 登录
interface loginParams{
  userName:string,
  password:string
}
export function loginByName(data:loginParams){
    return request({
        url:"/api/v1/login",
        method:"post",
        data
    })
}
// 获取个人信息
export function getUserInfo() {
  return request<{
      chinaname?: string;
      name?: string;
      email?: string;
      roles?: string[];
      officium?:string;
      money?:number | null;
      base64?: string;
  }>({
      url: "/api/v1/user",
      method: "get"
  })
}

// 注册
interface RegisterParams{
  chinaname:string
  password:string
  userName:string
  token:string
}
export function registerApi(data:RegisterParams){
  return request({
    url:"/api/v1/enroll",
    method:"POST",
    data
  })
}

// 更新qq号
export function updateQQ(qqnumber:string){
  return request({
    url:'/api/qqbotr/qqnumber',
    method:'POST',
    params:{
      qqnumber
    }
  })
}
