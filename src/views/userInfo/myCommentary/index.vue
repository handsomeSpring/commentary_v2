<template>
  <nav-back title="我的解说场次" />
  <full-screen-loading v-if="loading"></full-screen-loading>
  <div class="main-body" v-else>
    <n-result style="height: calc(100dvh - 45px);display: flex;flex-direction: column;
    align-items: center;justify-content: center;" v-if="!isCommentary" status="403" title="无权限"
      description="您不是解说，无法查看历史解说信息">
      <template #footer>
        <n-button @click="handleBack">返回</n-button>
      </template>
    </n-result>
    <asg-empty v-else-if="comList.length === 0" description="太懒惰了吧,一场解说都没有">
    </asg-empty>
    <div v-else class="listTable">
      <div class="card-container" v-for="(item, index) in comList" :key="index">
        <div class="card-header">
          <p class="time-text" :class="item.isOver ? 'time-over' : 'time-process'">{{ item.isOver ?
            '赛程已结束' : '赛程进行中' }}
          </p>
          <div class="game-tag">
            <img src="../../../assets/images/gametag.png">
            <p>{{ item.tag || '未定义' }}</p>
          </div>
        </div>
        <div class="card-main">
          <div class="team-info">
            <n-avatar round :src="item.customLogo"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
            <p>{{ item.team1_name }}</p>
          </div>
          <img class="verse" src="../../../assets/images/VS.png">
          <div class="team-info">
            <n-avatar round :src="item.hostLogo"
              fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
            <p>{{ item.team2_name }}</p>
          </div>
        </div>
        <div class="card-footer">
          <li>
            <div class="left-icon">
              <img src="../../../assets/images/micro.png">
              <p>解说</p>
            </div>
            <div class="commentary-wrap">
              <div class="fill-person" v-for="(com, index) in computedCommentary(item.commentary)" :key="index" >
                {{ limitText(com,5,'虚位以待') }}
              </div>
            </div>
          </li>
          <li v-if="item.personType.includes('judge')">
            <div class="left-icon">
              <img src="../../../assets/images/judge.png">
              <p>裁判</p>
            </div>
            <p class="physize-text" :class="!item.judge ? 'none-info' : ''">{{ item.judge || '暂无裁判'
              }}</p>
          </li>
          <li v-if="item.personType.includes('referee')">
            <div class="left-icon">
              <img src="../../../assets/images/referee.png">
              <p>导播</p>
            </div>
            <p class="physize-text" :class="!item.referee ? 'none-info' : ''">{{ item.referee ||
              '暂无导播' }}</p>
          </li>
          <li>
            <div class="left-icon">
              <img src="../../../assets/images/time.png">
              <p>时间</p>
            </div>
            <p class="physize-text">{{ handleTime(item.opentime) }}</p>
          </li>
        </div>
        <div class="btn-list-wrap">
          <div class="my-button" :class="new Date >= new Date(item.opentime) ? 'disabled' : ''"
            @click="handleCancel(item)">
            {{ new Date >= new Date(item.opentime) ? '无法取消' : '取消选班' }}</div>
        </div>
      </div>
    </div>
  </div>
  <!-- 挂在在body的弹窗部分 -->
  <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="取消该班次的原因" positive-text="提交"
    negative-text="算了" @positive-click="onPositiveClick" @negative-click="onNegativeClick">
    <n-input v-model:value="cancelReason" type="textarea" placeholder="请输入取消该场次的原因" maxlength="50" show-count></n-input>
  </n-modal>
</template>

<script setup lang='ts'>
import { getMyCommentary, cancelCommentary } from "@/api/commentary";
import { useMessage } from "naive-ui";
import { isJSON,limitText } from "@/utils";


const showModal = ref(false);
const cancelReason = ref('');
const cancelId = ref(0);
const uMessage = useMessage();
const loading = ref(false);
const comList = ref([]); //我的解说列表
const isCommentary = ref(true); //是否是解说
const router = useRouter();
const handleBack = () => {
  router.go(-1);
}
const handleTime = (value: string) => {
  const year = new Date(value).getFullYear();
  const month = new Date(value).getMonth() + 1;
  const day = new Date(value).getDate();
  const hour = new Date(value).getHours();
  const min = new Date(value).getMinutes();
  return year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分';
};
async function initMyCommentary() {
  try {
    loading.value = true;
    const { data, status } = await getMyCommentary();
    if (status !== 200) throw new Error('服务端异常,请联系网站管理员');
    comList.value = data.map(item => {
      return {
        ...item,
        personType: item.person_type ?? 'referee,commentary',
        customLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team1_name}.png`,
        hostLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team2_name}.png`,
      }
    });
  } catch (error) {
    if (error.response?.data?.code === 400) {
      isCommentary.value = false;
      return uMessage.warning('获取选班列表失败，您不是解说。');
    }
    uMessage.error(error.customMessage ? error.customMessage : error.response.data.message);
  } finally {
    loading.value = false;
  }
};
initMyCommentary()

const computedCommentary = (value: string) => {
  if (!value) {
    return []
  } else {
    if (isJSON(value)) {
      return JSON.parse(value).map(item => item.chinaname);
    } else {
      return ['无法解析解说名'];
    }
  }
}

// 取消选班
const handleCancel = (item) => {
  if (new Date >= new Date(item.opentime)) return;
  showModal.value = true;
  cancelId.value = item.id;
}

const onNegativeClick = () => {
  showModal.value = false;
  cancelReason.value = '';
}

const onPositiveClick = async () => {
  try {
    if (!cancelReason.value) {
      uMessage.warning('请填写原因！');
      return;
    }
    showModal.value = false;
    const { status } = await cancelCommentary(cancelId.value, cancelReason.value);
    if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
    uMessage.success('取消成功，请及时通知主办方');
    initMyCommentary();
  } catch (error) {
    uMessage.error(!error.response ? error.customMessage : (error.response?.data?.message ?? '未知错误，请联系网站管理员'));
  }
}
</script>
<style scoped lang='scss'>
.listTable {
  padding:12px;
  min-height: calc(100dvh - 84px);
  background: #F5F6F7;
  position: relative;
  //卡片开始
  .card-container {
    border-radius: 16pt;
    padding: 12px 12px 23px;
    margin: 12px auto;
    background: #fff;

    .card-header {
      height: 32px;
      border-bottom: 1px solid #D3E8DA;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .time-text {
        font-size: 14px;

        &.time-process {
          color: #2b8248;
        }

        &.time-over {
          color: #EF2D2D;
        }
      }

      .game-tag {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 1px 4px;
        border-radius: 8px;
        background: #CAE5D3;

        p {
          font-size: 13px;
          color: #105126;
        }
      }
    }

    // 主体战队部分
    .card-main {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 5em;
      gap: 55pt;
      padding: 12pt 0 17pt;

      .team-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8pt;

        p {
          color: #1A1A1A;
          font-size: 14px;
        }

        img {
          width: 36pt;
          height: 36pt;
        }
      }
    }

    // 底部
    .card-footer {
      margin-bottom: 17px;

      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5pt 0;
        border-bottom: 1px solid #D3E8DA;

        .left-icon {
          display: flex;
          align-items: center;
          gap: 4pt;

          p {
            font-size: 12px;
            color: #004671;
            font-weight: 500;
          }
        }

        .physize-text {
          color: #000000;
          font-size: 14px;

          &.none-info {
            color: #9CC9E5;
          }
        }

        // 解说
        .commentary-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          .fill-person {
            padding: 2px 6px;
            font-size: 14px;
            border-radius: 6px;
            color: #EF2D2D;
            background: #FFC8C8;
          }

        }
      }
    }

    // 操作区域

    .btn-list-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12pt;

      .my-button {
        padding: 8px 32px;
        border-radius: 16pt;
        font-size: 16px;
        background: #AED2E8;
        cursor: pointer;

        &.disabled {
          background: #E4E4E4;
          color: #161513;
        }
      }
    }

    // 提示词
    .forbid-choose-text {
      text-align: center;
      font-size: 1em;
      color: #FF4949;
      width: 100%;
    }
  }
}
</style>