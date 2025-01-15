
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
}

declare module '@/components/*';
declare module '@/store/*';
declare module '@/utils/*';

interface ComRole {
    base64?:string
    chinaname:string
    email:string
    id:number
    isadmin:boolean
    money?:number
    name:string
    officium?:string
    qqnumber?:string
}

