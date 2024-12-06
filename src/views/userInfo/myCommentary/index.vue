<template>
  <nav-back title="我的解说场次" />
  <template v-if="loading">
    <n-skeleton text :repeat="4" />
    <n-skeleton text style="width: 87%" :repeat="2" />
    <n-skeleton text style="width: 70%" :repeat="2" />
    <n-skeleton text style="width: 50%" />
  </template>
  <template v-else>
    <n-result style="height: calc(100dvh - 45px);display: flex;flex-direction: column;
    align-items: center;justify-content: center;" v-if="!isCommentary" status="403" title="无权限"
      description="您不是解说，无法查看历史解说信息">
      <template #footer>
        <n-button @click="handleBack">返回</n-button>
      </template>
    </n-result>
    <n-empty style="margin-top:30px" v-else-if="comList.length === 0" description="太懒惰了吧,一场解说都没有"></n-empty>

    <ul class="com-list-conatainer" v-else>
      <li class="item-wrap" v-for="(item, index) in comList" :key="index">
        <header>
          <p>
            <n-gradient-text type="info">
              {{ item.belong || '未知赛季' }}
            </n-gradient-text>
          </p>
          <n-tag :bordered="false" type="info">
            {{ item.tag || '未定义' }}
          </n-tag>
        </header>
        <main>
          <div class="team-info">
            <n-badge :value="`赞${item.team1_piaoshu || 0}`">
              <n-avatar round>主场</n-avatar>
            </n-badge>
            <p class="blue-game">{{ item.team1_name }}</p>
          </div>
          <n-icon size="24" color="#9CC9E5">
            <GameControllerSharp />
          </n-icon>
          <div class="team-info">
            <n-badge :value="`赞${item.team2_piaoshu || 0}`">
              <n-avatar round>客场</n-avatar>
            </n-badge>
            <p class="red-game">{{ item.team2_name }}</p>
          </div>
        </main>
        <n-collapse :trigger-areas="triggerAreas">
          <n-collapse-item style="margin:0 12px" title="详细信息">
            <template #header-extra>
              <n-button v-show="new Date(item.opentime) > new Date()" size="tiny" type="error"
                @click="handleCancel(item)">取消选班</n-button>
            </template>
            <div class="info-list">
              <div class="one-line">
                <n-tag size="small" :bordered="false" type="warning">
                  时间
                </n-tag>
                {{ item.opentime.slice(0, 16).replace('T', ' ') }}
              </div>
              <div class="one-line">
                <n-tag size="small" :bordered="false" type="info">
                  解说
                </n-tag>
                {{ computedCommentary(item.commentary) || '无' }}
              </div>
              <div class="one-line" v-if="item.personType.includes('referee')">
                <n-tag size="small" :bordered="false" type="warning">
                  导播
                </n-tag>
                {{ item.referee }}
              </div>
              <div class="one-line" v-if="item.personType.includes('judge')">
                <n-tag size="small" :bordered="false" type="error">
                  裁判
                </n-tag>
                {{ item.judge }}
              </div>
            </div>
          </n-collapse-item>
        </n-collapse>
      </li>
    </ul>
  </template>

  <!-- 弹窗部分 -->
  <!-- 挂在在body的弹窗部分 -->
  <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="取消该班次的原因" positive-text="提交"
    negative-text="算了" @positive-click="onPositiveClick" @negative-click="onNegativeClick">
    <n-input v-model:value="cancelReason" type="textarea" placeholder="请输入取消该场次的原因" maxlength="50" show-count></n-input>
  </n-modal>
</template>

<script setup lang='ts'>
import { GameControllerSharp } from "@vicons/ionicons5";
import { getMyCommentary, cancelCommentary } from "@/api/commentary";
import { useMessage } from "naive-ui";
import { isJSON } from "@/utils";


const showModal = ref(false);
const cancelReason = ref('');
const cancelId = ref(0);
const uMessage = useMessage();
const loading = ref(false);
const comList = ref([]); //我的解说列表
const triggerAreas = ref(['main', 'arrow']);
const isCommentary = ref(true); //是否是解说
const router = useRouter();
const handleBack = ()=>{
  router.go(-1);
}
async function initMyCommentary() {
  try {
    loading.value = true;
    const { data, status } = await getMyCommentary();
    if (status !== 200) throw new Error('服务端异常,请联系网站管理员');
    comList.value = data.map(item => {
      return {
        ...item,
        personType: item.person_type ?? 'referee,commentary'
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
      return JSON.parse(value).map(item => item.chinaname).join(' ');
    } else {
      return ['无法解析解说名', '无法解析解说名'];
    }
  }
}

// 取消选班
const handleCancel = (item) => {
  showModal.value = true;
  cancelId.value = item.id;
}

const onNegativeClick = () => {
  showModal.value = false;
  cancelReason.value = '';
}

const onPositiveClick = async () => {
  try {
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
.com-list-conatainer {
  width: 100%;
  padding-top: 12px;
  background-color: #e7e7e7;
  min-height: calc(100dvh - 57px);
  overflow: auto;

  .item-wrap {
    margin: 0 auto 12px;
    width: 90%;
    border-radius: 7px;
    background: #fff;
    padding: 12px 0;

    header {
      width: 95%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    main {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin: 12px 0;

      .team-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 30%;

        .red-game {
          font-weight: 600;
          color: rgb(255, 108, 82);
          margin-top: 2px;
        }

        .blue-game {
          font-weight: 600;
          color: #9CC9E5;
          margin-top: 2px;
        }

        img {
          width: 4em;
          height: 4em;
        }
      }
    }

    .info-list {
      display: flex;
      flex-direction: column;
      width: 95%;
      margin: 0 auto;

      .one-line {
        display: flex;
        align-items: center;
        gap: 1em;
        margin: 0.2em 0;
      }
    }
  }
}
</style>