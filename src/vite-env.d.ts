declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@/components/*';
declare module '@/store/*';
declare module '@/utils/*';
declare module '@/router/*';

declare module 'vue-router' {
    interface RouteLocationNormalizedLoaded {
        query: Record<string, string>
    }
}
