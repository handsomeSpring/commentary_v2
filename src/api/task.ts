import request from "@/utils/request";
// 获取用户的任务
export function getTask(userid:number){
    return request({
      url:"/api/v1/Tasks",
      method:"GET",
      params:{
        userid
      }
    })
  }

  // 用户自己点完成任务
export function taskFinish(taskid:number){
  return request({
    url:"/api/v1/Task",
    method:"GET",
    params:{
      taskid
    }
  })
}