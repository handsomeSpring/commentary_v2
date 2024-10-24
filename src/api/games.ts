import request from "@/utils/request"

export function getAllEvents() {
    return request({
        url: "/api/v1/Events",
        method: "get"
    })
}

interface ParamsAllGames {
    page: number,
    limit: number,
    belong: string
}
// 获取所有赛程
interface Match {
  belong:string
  bilibiliuri?:string
  commentary:string
  id:number
  opentime:string
  referee:string
  tag?:string
  team1_name:string
  team2_name:string
  team1_piaoshu:number
  team2_piaoshu:number
  winteam?:string
  judge?:string
  person_type:string
  com_limit:1 | 2 | 3
}
export function getAllGames(params: ParamsAllGames) {
    return request<Match[]>({
        url: "/api/v1/game",
        method: "get",
        params: {
            page: params.page,
            page_long: params.limit,
            belong: params.belong
        }
    })
}

interface Roles {
    common_Roles?:string
    role_lin:'求生者' | '监管者'
    role_name:string
    historical_Ranks?:number 
}
interface Event {
    id: number
    name: string
    opentime: string
}
interface TeamForm {
    id: number
    team_name: string
    team_tel: string
    piaoshu: number
    logo_uri:string
    role: Roles[]
}
interface Champion {
    events: Event
    form: TeamForm
    id: number
    msg: string
}
// 获取冠军列表
export function getChampion() {
    return request<Champion[]>({
        url: '/api/v1/Champion',
        method: 'GET',
    })
}