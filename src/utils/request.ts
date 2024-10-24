import axios from 'axios'
import { getToken } from "@/utils/auth";
import eventEmitter from './eventEmitter';

interface CustomError {
    customMessage?:string 
}
//配置请求的根路径
axios.defaults.baseURL = 'https://api.idvasg.cn';
axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${getToken()}`;
    return config;
})
// 添加响应拦截器
axios.interceptors.response.use(
(response) => {
    return response;
}, 
(error) => {
    console.log(error);
    const response = error.response;
    if(!response){
        return Promise.reject(error);
    }
    if(response.status === 401){
        eventEmitter.emit('API:UN_AUTH');
        const customError:CustomError = new Object();
        customError.customMessage = '鉴权过期，请重新登录'
        return Promise.reject(customError);
    }
    return Promise.reject(error);
});
export default axios