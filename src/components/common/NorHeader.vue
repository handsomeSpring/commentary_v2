<template>
    <div class="header-bar">
        <div class="l-p">
            <n-avatar 
            v-show="activeMenu !== '4'" 
            round
            :size="28" 
            :src="userStore.userInfo.base64 ?? `empty.png`"
            fallback-src="/logo/asg.png"
            @click="handleLoginOut" />
            <n-icon v-show="activeMenu === '4'" size="18" @click="routerBack">
                <ChevronBackSharp />
            </n-icon>
        </div>
        <div class="center-p">{{ props.title }}</div>
        <div class="r-p">
            <svg @click="showMenu" xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem"
                viewBox="0 0 512 512">
                <path d="M432 176H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
                    fill="currentColor" />
                <path d="M432 272H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
                    fill="currentColor" />
                <path d="M432 368H80c-8.8 0-16-7.2-16-16s7.2-16 16-16h352c8.8 0 16 7.2 16 16s-7.2 16-16 16z"
                    fill="currentColor" />
            </svg>
        </div>
    </div>
    <div class="menu-box" :class="menuActive ? 'menu-box-active' : ''">
        <div class="menu-container">
            <div class="menu-item" @click="hanleRouter('/home')">
                <svg :style="{ color: props.activeMenu === '1' ? '#CAE5D3' : '#ebedf3' }"
                    xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 512 512">
                    <path
                        d="M126.8 248.3c39.7-58.6 77.9-92.8 77.9-92.8s-42.1-48.9-92.8-67.4l-3.3-.8C61.7 128.4 32 188.7 32 256c0 50.7 16.9 97.5 45.2 135 0-4.4.6-70.3 49.6-142.7z"
                        fill="currentColor" />
                    <path
                        d="M480 256c0-67.3-29.7-127.6-76.6-168.7l-3.2.9c-50.7 18.5-92.9 67.4-92.9 67.4s38.2 34.2 77.9 92.8c49 72.4 49.6 138.3 49.5 142.7C463.2 353.5 480 306.7 480 256z"
                        fill="currentColor" />
                    <path
                        d="M201.2 80.9c29.3 13.1 54.6 34.6 54.6 34.6s25.5-21.4 54.8-34.6c36.8-16.5 64.9-11.3 72.3-9.5C346.8 46.6 303.1 32 256 32c-47.1 0-90.8 14.6-126.9 39.4 7.2-1.8 35.2-7.1 72.1 9.5z"
                        fill="currentColor" />
                    <path
                        d="M358.7 292.9C312.4 236 255.8 199 255.8 199s-56.3 37-102.7 93.9c-39.8 48.9-54.6 84.8-62.6 107.8l-1.3 4.8c41 45.7 100.5 74.5 166.8 74.5 66.3 0 125.8-28.8 166.8-74.5l-1.4-4.8c-8-23-22.9-58.9-62.7-107.8z"
                        fill="currentColor" />
                </svg>
                <p :class="props.activeMenu === '1' ? 'activeTitle' : ''">赛程中心</p>
            </div>
            <div class="menu-item" @click="hanleRouter('/supermarket')">
                <svg :style="{ color: props.activeMenu === '2' ? '#CAE5D3' : '#ebedf3' }"
                    xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 512 512">
                    <path
                        d="M424 134.5h-45.8c2.3-6.6 3.8-13.9 3.8-21.3 0-35.4-28.1-63.2-63-63.2-22.1 0-41.2 10.7-52.5 28L256 92.3l-10.5-14.5C234.2 60.7 215.1 48 193 48c-34.9 0-63 29.8-63 65.2 0 7.5 1.5 14.7 3.8 21.3H88c-23.3 0-41.8 19-41.8 42.7L46 421.8c0 23.7 17.4 42.2 40.7 42.2h336.7c23.3 0 42.7-18.5 42.7-42.2V177.2c-.1-23.7-18.8-42.7-42.1-42.7zM320 91c11.6 0 21 9.5 21 21 0 11.6-9.4 21-21 21s-21-9.5-21-21 9.4-21 21-21zm-128 0c11.6 0 21 9.5 21 21 0 11.6-9.4 21-21 21s-21-9.5-21-21 9.4-21 21-21zM88 177.2h106.7L151 237.5l34 25 50-69.1.2-.2-.2 228.6H88V177.2zm336 244.6H277V193.4l50 69.1 34-25-43.7-60.4H424v244.7z"
                        fill="currentColor" />
                </svg>
                <p :class="props.activeMenu === '2' ? 'activeTitle' : ''">兑换中心</p>
            </div>
            <div class="menu-item" @click="hanleRouter('/enroll')">
                <svg :style="{ color: props.activeMenu === '3' ? '#CAE5D3' : '#ebedf3' }"
                    xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M256 112a56 56 0 1 1 56-56a56.06 56.06 0 0 1-56 56" />
                    <path fill="currentColor"
                        d="m432 112.8l-.45.12l-.42.13c-1 .28-2 .58-3 .89c-18.61 5.46-108.93 30.92-172.56 30.92c-59.13 0-141.28-22-167.56-29.47a74 74 0 0 0-8-2.58c-19-5-32 14.3-32 31.94c0 17.47 15.7 25.79 31.55 31.76v.28l95.22 29.74c9.73 3.73 12.33 7.54 13.6 10.84c4.13 10.59.83 31.56-.34 38.88l-5.8 45l-32.19 176.19q-.15.72-.27 1.47l-.23 1.27c-2.32 16.15 9.54 31.82 32 31.82c19.6 0 28.25-13.53 32-31.94s28-157.57 42-157.57s42.84 157.57 42.84 157.57c3.75 18.41 12.4 31.94 32 31.94c22.52 0 34.38-15.74 32-31.94a57 57 0 0 0-.76-4.06L329 301.27l-5.79-45c-4.19-26.21-.82-34.87.32-36.9a1 1 0 0 0 .08-.15c1.08-2 6-6.48 17.48-10.79l89.28-31.21a17 17 0 0 0 1.62-.52c16-6 32-14.3 32-31.93S451 107.81 432 112.8" />
                </svg>
                <p :class="props.activeMenu === '3' ? 'activeTitle' : ''">成为解说</p>
            </div>
            <div class="menu-item" @click="hanleRouter('/userInfo')">
                <svg :style="{ color: props.activeMenu === '4' ? '#CAE5D3' : '#ebedf3' }"
                    xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 512 512">
                    <path fill="currentColor"
                        d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38c-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6M432 480H80a31 31 0 0 1-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75c1.94 10.73-.68 21.34-7.18 29.11A31 31 0 0 1 432 480" />
                </svg>
                <p :class="props.activeMenu === '4' ? 'activeTitle' : ''">个人中心</p>
            </div>
        </div>
    </div>
    <slot></slot>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { useDialog,useMessage } from 'naive-ui';
import { removeToken } from '@/utils/auth';
import { ChevronBackSharp } from "@vicons/ionicons5"
const userStore = useUserStore();
const nMessage = useMessage();
const dialog = useDialog();
const router = useRouter();
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    activeMenu: {
        type: String,
        default: "1"
    }
});
const menuActive = ref<boolean>(false);
const showMenu = () => {
    menuActive.value = !menuActive.value;
}
const handleLoginOut = () => {
    dialog.success({
        title: '提示',
        content: '你确定退出登录？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: () => {
            nMessage.success('登出成功！');
            userStore.clearInfo();
            removeToken();
            router.push({path:'/login'})
        },
        onNegativeClick: () => {
            nMessage.info('取消')
        }
    })
}
const hanleRouter = (path:string) => {
    router.push({path});
}
const routerBack = () => {
    router.back();
}
</script>
<style scoped lang='scss'>
.header-bar {
    width: 100vw;
    display: grid;
    padding: 12px 0;
    height:calc(52px - 12px - 12px);
    grid-template-columns: 50px auto 50px;
    background: #9CC9E5;
    // position: sticky;
    // top:0;
    div {
        color: #ebedf3;
        font-size: 1rem;
        font-weight: bold;
        display: flex;
        align-items: center;
    }

    .l-p {
        padding-left: 6px;
        justify-content: end;
    }

    .center-p {
        justify-content: center;
    }

    .r-p {
        padding-right: 6px;
        cursor: pointer;
        justify-content: start;
    }
}

.menu-box {
    display: grid;
    grid-template-rows: 0fr;
    transition: .3s;
    background: #fff;
    overflow: hidden;

    &.menu-box-active {
        grid-template-rows: 1fr;
        background: #9CC9E5;
    }

    .menu-container {
        padding: 0 12px;
        width: 100vw;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        min-height: 0;
        gap: 24px;

        .menu-item {
            aspect-ratio: 4/3;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 6px 0;

            p {
                margin: 6px 0;
                font-size: 0.7rem;
                color: #ebedf3;
            }

            .activeTitle {
                color: #CAE5D3;
            }
        }
    }
}
</style>