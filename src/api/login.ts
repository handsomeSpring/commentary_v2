import request from "@/utils/request"

// 登录
interface loginParams {
  userName: string,
  password: string
}
export function loginByName(data: loginParams) {
  return request({
    url: "/api/v1/login",
    method: "post",
    data
  })
}
type Roles = 'admin' | 'nbadmin'
// 获取个人信息
export function getUserInfo() {
  return request<{
    chinaname?: string;
    name?: string;
    email?: string;
    roles?: Roles[];
    officium?: string;
    money?: number | null;
    base64?: string;
    qqnumber?: string
  }>({
    url: "/api/v1/user",
    method: "get"
  })
}

// 注册
interface RegisterParams {
  chinaname: string
  password: string
  userName: string
  token: string
}
export function registerApi(data: RegisterParams) {
  return request({
    url: "/api/v1/enroll",
    method: "POST",
    data
  })
}

// 更新qq号
export function updateQQ(qqnumber: string) {
  return request({
    url: '/api/qqbotr/qqnumber',
    method: 'POST',
    params: {
      qqnumber
    }
  })
}

// 新版注册-获取人机校验码
export function makeCaptcha() {
  return request({
    url: '/api/v2/makeCaptcha',
    method: 'GET',
  })
}

// 新版注册
interface EnrollV2 {
  userName: string,
  password: string,
  chinaname: string,
  captcha: string
}
export function enrollV2(data:EnrollV2) {
  return request({
    url: '/api/v2/enroll',
    method: 'post',
    data
  })
}