<template>
  <div class="header-bar">
    <div class="l-p">
      <n-avatar
        v-show="activeMenu !== '4'"
        round
        :size="28"
        :src="userStore.userInfo.base64 ?? `empty.png`"
        fallback-src="/logo/asg.png"
        @click="handleLoginOut"
      />
      <n-icon v-show="activeMenu === '4'" size="18" @click="routerBack">
        <ChevronBackSharp />
      </n-icon>
    </div>
    <div class="center-p">{{ props.title }}</div>
    <div class="r-p"></div>
  </div>
  <div class="main-content">
    <slot></slot>
  </div>
  <div class="menu-box">
    <div class="menu-container">
      <div class="menu-item" @click="hanleRouter('/home')">
        <svg
          :style="{ fill: props.activeMenu === '1' ? '#CAE5D3' : '#ebedf3' }"
          t="1732170658187"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="18910"
          id="mx_n_1732170658190"
          width="1.6em"
          height="1.6em"
        >
          <path
            d="M204.944 915.888c-42.48 0-76.944-40.128-76.944-89.648V378.56h767.856v447.648c0 49.536-34.32 89.664-76.928 89.664H204.944z m97.968-251.152a20.752 20.752 0 0 0-20.752 20.752v62.272a20.768 20.768 0 0 0 20.752 20.752h62.272a20.752 20.752 0 0 0 20.752-20.752v-62.272a20.752 20.752 0 0 0-20.752-20.752h-62.272z m186.816 0a20.752 20.752 0 0 0-20.768 20.752v62.272a20.752 20.752 0 0 0 20.768 20.752h62.256a20.752 20.752 0 0 0 20.768-20.752v-62.272a20.752 20.752 0 0 0-20.768-20.752h-62.272z m0-166.048a20.752 20.752 0 0 0-20.768 20.752v62.272a20.752 20.752 0 0 0 20.768 20.752h62.256a20.752 20.752 0 0 0 20.768-20.752V519.44a20.752 20.752 0 0 0-20.768-20.752h-62.272z m186.8 0a20.752 20.752 0 0 0-20.752 20.752v62.272a20.752 20.752 0 0 0 20.752 20.752H738.8a20.752 20.752 0 0 0 20.752-20.752V519.44a20.752 20.752 0 0 0-20.752-20.752h-62.272z m0 166.048a20.752 20.752 0 0 0-20.752 20.752v62.272a20.752 20.752 0 0 0 20.752 20.752H738.8a20.752 20.752 0 0 0 20.752-20.752v-62.272a20.752 20.752 0 0 0-20.752-20.752h-62.272zM371.84 515.904l-52.592 49.12-20.32-18.88a16.672 16.672 0 0 0-21.744 0.624 14.048 14.048 0 0 0-0.688 20.208l33.552 31.344a16.736 16.736 0 0 0 17.376 3.104c2.56-0.752 4.832-2.08 6.848-3.872l62.48-58.32a15.776 15.776 0 0 0 0-23.328 18.688 18.688 0 0 0-24.912 0z"
            p-id="18911"
          ></path>
          <path
            d="M818.992 167.712h-87.664v-62.064c0-16.736-11.488-29.536-25.392-29.536-13.84 0-25.328 13.344-25.328 29.536v62.08H339.312v-62.08c0-16.736-11.488-29.536-25.392-29.536-13.84 0-25.328 13.344-25.328 29.536v62.08h-83.52c-42.608 0-76.928 40.112-76.928 89.664v89.248H896v-89.248c-0.064-49.68-34.448-89.68-77.008-89.68z"
            p-id="18912"
          ></path>
        </svg>
        <p :class="props.activeMenu === '1' ? 'activeTitle' : ''">赛程中心</p>
      </div>
      <div class="menu-item" @click="hanleRouter('/supermarket')">
        <svg
          :style="{ fill: props.activeMenu === '2' ? '#CAE5D3' : '#ebedf3' }"
          t="1732170807212"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="23885"
          id="mx_n_1732170807213"
          width="1.6em"
          height="1.6em"
        >
          <path
            d="M177.7664 216.6272c-21.0944 0-40.96-1.024-61.184 0-34.6624 2.4064-65.3824-39.68-48.1792-78.7968a37.9392 37.9392 0 0 1 36.4544-22.8352c33.2288-0.5632 66.56-0.8192 99.7376 0 27.8016 0.768 43.3152 13.1072 50.2784 40.192A370.2784 370.2784 0 0 1 261.12 201.984c1.792 13.9264 3.4304 27.8528 5.12 42.3424h618.0864a71.68 71.68 0 0 1 43.9296 12.1856c15.36 11.2128 19.3024 29.2352 11.5712 51.8656-10.5472 30.72-21.6576 61.44-32.1536 92.16-12.032 35.5328-22.8352 71.68-35.84 106.7008-12.288 33.792-35.1232 52.3264-72.6016 52.1728-150.4768-0.7168-300.9536-0.3072-451.4304-0.3072h-13.312c4.1984 25.2416 8.3968 49.4592 12.0832 73.7792 1.1264 7.3216 5.7344 6.7072 10.752 6.656h430.6432a142.8992 142.8992 0 0 1 26.4704 2.2528 27.1872 27.1872 0 0 1 22.8352 24.1664c4.1472 25.6-7.168 52.0704-41.5744 51.9168-153.088-0.512-306.2272-0.8192-459.3664 0-39.8336 0.256-61.44-23.3472-70.0928-58.4704-14.1824-56.0128-24.0128-113.152-35.1744-169.8816-17.2032-87.04-33.8944-174.3872-50.8416-261.5808-0.6144-3.1744-1.4336-6.7072-2.4576-11.3152zM732.16 908.7488c-37.632 1.6896-85.7088-39.8336-83.7632-81.3056 2.0992-46.848 33.0752-82.688 81.5616-83.456s85.4528 34.7136 86.3232 80.896c0.7168 44.5952-39.168 83.712-84.1216 83.8656zM359.2192 905.0624A81.92 81.92 0 0 1 276.48 824.576c-0.3584-43.1616 36.9152-81.408 79.7184-81.92 47.0528-0.4096 85.9648 36.2496 85.9136 80.7936a82.2784 82.2784 0 0 1-82.8928 81.6128z"
            p-id="23886"
          ></path>
        </svg>
        <p :class="props.activeMenu === '2' ? 'activeTitle' : ''">兑换中心</p>
      </div>
      <div class="menu-item" @click="hanleRouter('/enroll')">
        <svg
          t="1732170904436"
          class="icon"
          :style="{ fill: props.activeMenu === '3' ? '#CAE5D3' : '#ebedf3' }"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4631"
          width="1.6em"
          height="1.6em"
        >
          <path
            d="M607.232 896a32 32 0 1 1 0 64H192a96 96 0 0 1-96-96V160a96 96 0 0 1 96-96h544a96 96 0 0 1 96 96 32 32 0 0 1-64 0 32 32 0 0 0-32-32H192a32 32 0 0 0-32 32v704a32 32 0 0 0 32 32h415.232zM832 585.76v146.656c0 42.656-64 42.656-64 0V585.76c0-42.688 64-42.688 64 0z"
            p-id="4632"
          ></path>
          <path
            d="M288 320a32 32 0 1 1 0-64h224a32 32 0 0 1 0 64H288z m0 160a32 32 0 0 1 0-64h128a32 32 0 0 1 0 64H288z m351.424 446.592a32 32 0 1 1-64 0L576 800a96 96 0 0 1 96-96l127.744 1.152a32 32 0 1 1 0 64L672 768a32 32 0 0 0-32 32l-0.576 126.592z"
            p-id="4633"
          ></path>
          <path
            d="M637.92 947.648a32 32 0 1 1-44.32-46.208l180.384-172.992a32 32 0 1 1 44.288 46.176L637.92 947.648z m242.976-613.12a31.424 31.424 0 0 0 3.328-44.416l-0.416-0.512a32 32 0 0 0-44.896-3.36L408.32 652.288l-15.2 51.84 58.336-4.544 429.44-365.056z m51.616-86.4a95.36 95.36 0 0 1-9.408 134.496l-438.08 372.448a32 32 0 0 1-18.24 7.52l-114.944 8.896a32 32 0 0 1-33.184-40.928L349.6 625.088a32 32 0 0 1 9.984-15.36l437.824-372.224a96 96 0 0 1 134.688 10.112l0.416 0.512z"
            p-id="4634"
          ></path>
        </svg>
        <p :class="props.activeMenu === '3' ? 'activeTitle' : ''">申请加入</p>
      </div>
      <div class="menu-item" @click="hanleRouter('/userInfo')">
        <svg
          t="1732171000871"
          class="icon"
          :style="{ fill: props.activeMenu === '4' ? '#CAE5D3' : '#ebedf3' }"
          viewBox="0 0 1175 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="11838"
          width="1.6em"
          height="1.6em"
        >
          <path
            d="M1116.672 128H58.368c-32.256 0-58.368 26.112-58.368 58.368v651.264c0 32.256 26.112 58.368 58.368 58.368H1116.672c32.256 0 58.368-26.112 58.368-58.368V186.368c0-32.256-26.112-58.368-58.368-58.368zM578.56 765.44H163.328c-8.704 0-15.36-6.656-15.872-15.36v-1.536c4.096-54.272 26.624-104.96 65.024-143.872 25.6-25.6 55.808-44.544 89.088-55.296-26.112-13.824-47.616-34.816-61.952-60.416-12.8-22.528-20.48-48.64-20.48-76.288 0-84.992 68.096-153.6 151.552-153.6S522.752 327.68 522.752 412.16c0 27.648-7.68 53.76-20.48 76.288-14.336 25.6-35.84 46.592-61.952 60.416 33.28 10.752 63.488 29.696 89.088 55.296 38.4 38.912 60.928 89.6 65.024 145.408-0.512 9.216-7.168 15.872-15.872 15.872z m449.536-96.256c0 16.384-13.312 29.696-29.696 29.696h-298.496c-16.384 0-29.696-13.312-29.696-29.696v-1.536c0-16.384 13.312-29.696 29.696-29.696h298.496c16.384 0 29.696 13.312 29.696 29.696v1.536z m0-143.872c0 15.872-13.312 29.184-29.184 29.184h-300.032c-15.872 0-29.184-13.312-29.184-29.184v-3.072c0-15.872 13.312-29.184 29.184-29.184H998.912c15.872 0 29.184 13.312 29.184 29.184v3.072z m0-145.408c0 16.384-13.312 29.696-29.696 29.696h-298.496c-16.384 0-29.696-13.312-29.696-29.696v-1.536c0-16.384 13.312-29.696 29.696-29.696h298.496c16.384 0 29.696 13.312 29.696 29.696v1.536z"
            p-id="11839"
          ></path>
        </svg>
        <p :class="props.activeMenu === '4' ? 'activeTitle' : ''">个人中心</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { useDialog, useMessage } from "naive-ui";
import { removeToken } from "@/utils/auth";
import { ChevronBackSharp } from "@vicons/ionicons5";
const userStore = useUserStore();
const nMessage = useMessage();
const dialog = useDialog();
const router = useRouter();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  activeMenu: {
    type: String,
    default: "1",
  },
});
const handleLoginOut = () => {
  dialog.success({
    title: "提示",
    content: "你确定退出登录？",
    positiveText: "确定",
    negativeText: "取消",
    maskClosable: false,
    onPositiveClick: () => {
      nMessage.success("登出成功！");
      userStore.clearInfo();
      removeToken();
      router.push({ path: "/login" });
    },
    onNegativeClick: () => {
      nMessage.info("取消");
    },
  });
};
const hanleRouter = (path: string) => {
  router.push({ path });
};
const routerBack = () => {
  router.back();
};
</script>
<style scoped lang="scss">
.header-bar {
  width: 100%;
  display: grid;
  height: 52px;
  grid-template-columns: 50px auto 50px;
  align-items: center;
  background: #9cc9e5;
  position: fixed;
  top: 0;
  z-index: 999;
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
.main-content {
  margin-top: 52px;
  height: calc(100dvh - 52px - 4em);
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.menu-box {
  display: grid;
  overflow: hidden;
  background: #9cc9e5;
  position: fixed;
  bottom: 0;
  height: 4em;
  width: 100%;
  z-index: 999;
  .menu-container {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height:100%;
    .menu-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap:0.2em;
      height:100%;

      p {
        font-size: 0.8em;
        color: #ebedf3;
      }

      .activeTitle {
        color: #cae5d3;
      }
    }
  }
}
</style>
