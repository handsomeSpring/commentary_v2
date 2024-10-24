import request from "@/utils/request";

//购买商品
export function buyGoods(storeid:number[]){
    return request({
        url:"/api/v1/Store/Buy",
        method:"POST",
        data:storeid
    })
}

// 获取store商品
export function getStore(){
    return request({
        url:"/api/v1/Store",
        method:"GET"
    })
}