import request from "@/utils/request.js"

export function getByCode(code: string) {
    return request({
        url: "/api/config/api/v1/admin/config/byTitle",
        method: "POST",
        data: code,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// 根据职位获取用户
export function getByOpName(opname: string) {
    return request({
        url: "/api/v1/getuserbyop",
        method: "GET",
        params: {
            opname
        }
    })
}

// 获得所有职位用户
export function getUsersWithRole() {
    return request({
        url: '/api/v1/admin/officium/group',
        method: 'get'
    })
}

// 获取公告
export function getNews(type:string){
    return request({
        url: '/api/v1/news',
        method:"GET",
        params:{
            type
        }
    })
}

// 解说排名
export function getRankForCommentary(){
    return request({
        url:'/api/v1/user/ranking',
        method:'GET'
    })
}