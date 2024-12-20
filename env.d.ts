
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
}

declare module '@/components/*';
declare module '@/store/*';
declare module '@/utils/*';

