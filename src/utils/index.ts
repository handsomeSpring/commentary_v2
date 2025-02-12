//判断是否能够转JSON
export function isJSON(str?: string): boolean {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    }
    return false;
}

// 生成uuid
export function uuid<string>() {
    const s: string[] = [];
    const hexDigits: string = '0123456789abcdef';
    for (let i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = '4';
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
    const uuid = s.join('');
    return uuid;
}
function getRandomInt(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getMathIpv() {
    return `${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`;
}

export function handleTime(value:string){
    const year = new Date(value).getFullYear();
    const month = new Date(value).getMonth() + 1;
    const day = new Date(value).getDate();
    const hour = new Date(value).getHours();
    const min = new Date(value).getMinutes();
    return year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分';
}

// 处理字符串过长，隐藏手段
export const limitText = (com:(string | undefined),limit:number, undefinedCode:string) => {
    const limitLength = limit || 5;
    if(!com) return undefinedCode || '虚位以待';
    if(com.length > limitLength) return `${com.slice(0,limitLength)}..`;
    return com;
}