import request from '@/utils/request';

export function uploadAvatar(avatar:string){
    return request({
        url:'/api/v1/setimg',
        method:'POST',
        data:JSON.stringify(avatar),
        headers:{
            'Content-Type': 'application/json'
        }
    })
}
// 修改名称
export function updateName(newchinaname:string){
    return request({
        url:'/api/v1/user/name',
        method:'POST',
        params:{
            newchinaname
        }
    })
}