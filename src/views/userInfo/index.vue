<template>
  <nor-header title="个人中心" activeMenu="4">
    <div class="user-container">
      <div class="user-header" @click="routerTo('userInfo/userInfo',{type:'edit'})">
        <div class="l-p">
          <n-avatar 
          :size="56" 
          :src="userStore.userInfo.base64 ?? `empty.png`"
          fallback-src="/logo/asg.png"
           />
        </div>
        <div class="c-p">
          <p>
            {{ userStore.userInfo.chinaname.length > 7 ? (userStore.userInfo.chinaname.slice(0,7) + '...') : userStore.userInfo.chinaname }}
          </p>
          <p>积分：{{ userStore.userInfo.money || 0 }}</p>
        </div>
        <div class="r-p">
          <n-icon size="18" color="#fff">
            <ChevronForward />
          </n-icon>
        </div>
      </div>
      <div class="warning-text-container">
        <n-icon>
          <WarningSharp />
        </n-icon>
        注意：请完善信息后再进行解说选班！
      </div>
      <div class="main-container">
        <div class="quick-part">
          <div class="grid-item" @click="routerTo('/userInfo/myCommentary')">
            <img src="/icon/我的场次.png" />
            <p>我的场次</p>
          </div>
          <div class="grid-item" @click="routerTo('/champion')">
            <img src="/icon/历届冠军.png" />
            <p>历届冠军</p>
          </div>
          <div class="grid-item" @click="routerTo('/userInfo/myInvitation')">
            <img src="/icon/我的邀请.png" />
            <p>邀请记录</p>
          </div>
          <div class="grid-item" @click="routerTo('userInfo/responseInvite')">
            <img src="/icon/解说成员.png" />
            <p>回应邀请</p>
          </div>
        </div>
        <div class="last-container">
          <li class="grid-li-container" @click="routerTo('/userInfo/commentor')">
            <p>
              <n-icon size="18" color="#f02">
                <Mic />
              </n-icon>
              <span class="main-text">解说成员</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/myTask')">
            <p>
              <n-icon size="18" color="#07f">
                <Desktop />
              </n-icon>
              <span class="main-text">我的任务</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/myShopping')">
            <p>
              <n-icon size="18" color="#fdd">
                <BagCheck />
              </n-icon>
              <span class="main-text">我的购物</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/notice')">
            <p>
              <n-icon size="18" color="#999">
                <PulseSharp />
              </n-icon>
              <span class="main-text">最新公告</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('userInfo/userInfo',{type:'view'})">
            <p>
              <n-icon size="18" color="#409fEE">
                <InformationCircle />
              </n-icon>
              <span class="main-text">我的信息</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0',{},true)">
            <p>
              <n-icon size="18" color="#979797">
                <Easel />
              </n-icon>
              <span class="main-text">解说回放</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/comConfirm')">
            <p>
              <n-icon size="18" color="#4099FF">
                <FingerPrintOutline />
              </n-icon>
              <span class="main-text">身份认证</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/helpCenter')">
            <p>
              <n-icon size="18" color="#F40">
                <HelpCircleOutline />
              </n-icon>
              <span class="main-text">帮助中心</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
        </div>
        <div class="last-container">
          <li class="grid-li-container" @click="routerTo('/userInfo/version')">
            <p>
              <n-icon size="18" color="#d7d7d7">
                <Grid />
              </n-icon>
              <span class="main-text">系统版本</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
          <li class="grid-li-container" @click="routerTo('/userInfo/teamIntroduction')">
            <p>
              <n-icon size="18" color="#FF9900">
                <BodySharp />
              </n-icon>
              <span class="main-text">团队&系统介绍</span>
            </p>
            <n-icon size="18" color="#CAE5D3">
              <ChevronForward />
            </n-icon>
          </li>
        </div>
        <n-button type="error" size="small" block @click="handleLogOut">退出登录</n-button>
      </div>

    </div>
  </nor-header>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { ChevronForward, WarningSharp, Mic, Desktop, BagCheck, PulseSharp, InformationCircle, BodySharp, Easel, FingerPrintOutline, HelpCircleOutline, Grid } from "@vicons/ionicons5"
import { useDialog,useMessage } from 'naive-ui';
import { removeToken } from '@/utils/auth';
const dialog = useDialog();
const nMessage = useMessage();
const userStore = useUserStore();
const router = useRouter();
const handleLogOut = () => {
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
// 跳转
const routerTo = (path:string,query={},outline = false) =>{
  if(!path){
    nMessage.warning('功能正在开发中...请稍等');
  }
  if(outline){
    window.open(path,'_self');
    return;
  }
  router.push({ path,query })
}
</script>
<style scoped lang='scss'>
.user-container {
  .user-header {
    display: grid;
    grid-template-columns: 100px auto 100px;
    padding: 12px 0;
    align-items: center;
    width: 100%;
    background: #9CC9E5;

    div {
      display: flex;
      align-items: center;
    }

    .l-p {
      padding-left: 12px;
    }

    .c-p {
      flex-direction: column;
      align-items: flex-start;

      p:first-child {
        font-size: 1.2rem;
        font-weight: bold;
        color: #393939;
      }

      p:last-child {
        font-size: 0.8rem;
        font-weight: 500;
        color: #ebebeb;
      }
    }

    .r-p {
      justify-content: flex-end;
      padding-right: 12px;
    }
  }

  .warning-text-container {
    width: calc(100% - 48px);
    padding: 6px 24px;
    display: flex;
    align-items: center;
    color: rgb(236, 109, 80);

  }

  .main-container {
    padding: 12px;
    background: #e7e7e7;
    width: calc(100% - 24px);
    min-height: 80vh;

    .quick-part {
      display: grid;
      background: #fff;
      width: calc(100% - 24px);
      border-radius: 5px;
      grid-template-columns: repeat(4, 1fr);
      padding: 12px;
      margin-bottom: 12px;

      .grid-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        img {
          width: 35%;
          margin-bottom: 6px;
        }

        p {
          color: #6d88c3;
          font-weight: 500;
          font-size: 0.9rem;
        }
      }
    }

    .last-container {
      background: #fff;
      width: calc(100% - 24px);
      border-radius: 5px;
      padding: 0 12px;
      margin: 12px 0;

      .grid-li-container {
        padding: 6px 0;
        border-bottom: 1px solid #CAE5D3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:last-child{
          border-bottom: none;
        }
        p {
          display: flex;
          align-items: center;
        }

        .main-text {
          color: #9CC9E5;
          font-weight: 500;
          font-size: 16px;
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>