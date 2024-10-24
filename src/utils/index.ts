
export function isJSON(str?:string):boolean {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            return false;
        }
    }
    return false;
}

let roleArray = [];
getByCode("roleList").then(res => {
 
  })
// 职位转换
export const roleMap = {
    'Administration':'言论法官',
    'Anchor':'导播',
    'Arranger':'排班',
    'Commentator':'解说',
    'emcee':'主持人',
    'normal':'参赛用户',
    'Recruiter':'招募人',
    'Secretary':'秘书',
    'BackEnd':'后端',
    'BOSS':'主办方',
    'FrontEnd':'前端'
}