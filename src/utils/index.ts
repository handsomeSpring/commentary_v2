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