import request from "@/utils/request";

// 邀请成员
interface Invite {
    invitedId: number,
    matchId: number
}
export function inviteUser(data: Invite) {
    return request({
        url: "/api/v1/Invite",
        method: "POST",
        data
    })
}

interface Pagination {
    page: number
    limit: number
}
interface Game {
    belong:string
    bilibiliuri?:string
    commentary:string
    id:number
    opentime:string
    referee:string
    judge:string
    tag:string
    team1_name:string
    team1_piaoshu:number
    team2_name:string
    team2_piaoshu:number
    winteam?:string
}
type Status = 0 | 1 | 2 
interface InviteList {
    create_time: string
    invitedChinaname?: string
    invitorChinaname?:string
    id:number
    status:Status
    match?: Game
}
interface PaginationSplit{
    data:{
        rows: InviteList[]
        total: number,
    },
    code:number,
    message?:string
}
export function getMyInvite(params: Pagination) {
    return request<PaginationSplit>({
        url: "/api/v1/myInvitation",
        method: 'GET',
        params
    })
}

// 获取响应邀约
export function getBeInviteData(params: Pagination){
    return request<PaginationSplit>({
        url:"/api/v1/toInvite",
        method:"GET",
        params
    })
}

// 接受/拒绝邀请
interface ResponseTypeReq {
    status:1 | 2,
    id:number
}
export function refuseOrAgreeInv(data:ResponseTypeReq){
    return request({
        url:"/api/v1/recordAgreeOrDisagree",
        method:"POST",
        data
    })
}

// 撤销邀请
export function revokeInvite(id:number){
    return request({
        url:"/api/v1/delRecord",
        method:"DELETE",
        params:{
            id
        }
    })
}