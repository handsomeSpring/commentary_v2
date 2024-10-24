import request from "@/utils/request";

export function selectCom(gameid:number){
    return request({
      url:"/api/v1/com",
      method:"POST",
      params:{
        gameid
      }
    })
}

// 获取我的仓此
export function getMyCommentary(){
  return request({
    url:"/api/v1/com/my",
    method:"POST"
  })
}

// 取消选班
export function cancelCommentary(gameid:number){
  return request({
    url:"/api/v1/com",
    method:"DELETE",
    params:{
      gameid
    }
  })
}

// 我的兑换
export function getMyShopping(){
  return request({
    url:"/api/v1/Store/my",
    method:"GET"
  })
}

interface ComForm{
  chinaname: string,
  userId: number,
  sex: number,
  introduction: string,
  gameId: string,
  historyRank: string,
  contactNumber: string,
  id?: string
}
// 解说报名成为解说
export function beComingCommentary(data:ComForm){
  return request({
    url:'/api/v1/userRegister',
    method:'POST',
    data
  })
}

// 获取用户自己的表单信息
export function getMyEnrollHis(userid:number){
  return request({
    url:'/api/v1/userMsg',
    method:'GET',
    params:{
      userid
    }
  })
}