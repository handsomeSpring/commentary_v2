<template>
    <nav-back title="我的邀请记录" />
    <template v-if="loading">
        <n-skeleton text :repeat="4" />
        <n-skeleton text style="width: 87%" :repeat="2" />
        <n-skeleton text style="width: 70%" :repeat="2" />
        <n-skeleton text style="width: 50%" />
    </template>
    <template v-else>
        <div class="main__container" v-if="list.length === 0">
            <n-empty description="没有找到记录">
            </n-empty>
        </div>
        <div class="main__table" v-else>
            <n-timeline :icon-size="20">
                <n-timeline-item color="#F7A725" line-type="dashed" v-for="(item, index) in list" :key="index">
                    <template #header>
                        <div class="flex-header">
                            <p>
                                被邀请人：<span class="invite__name">{{ item.inivitePerson }}</span>
                            </p>
                            <n-button v-if="item.status === 0" strong secondary type="error" @click="handleRevoke(item.id)">
                                撤销邀请
                            </n-button>
                        </div>

                    </template>
                    <template #icon>
                        <n-icon>
                            <StopCircle />
                        </n-icon>
                    </template>
                    <n-alert class="n__alert--container" :show-icon="false" :type="computedStatus(item.status)">
                        <div class="game__info">
                            <div class="asg__tag tag--error" type="error">
                                <n-icon>
                                    <LogoXbox />
                                </n-icon>
                                <p>{{ item.gameTag }}</p>
                            </div>
                            <div class="asg__tag tag--warning">
                                <n-icon>
                                    <PersonSharp />
                                </n-icon>
                                <P>{{ item.gamePlayer }}</P>
                            </div>
                        </div>
                        <p>赛季：{{ item.gameSeason }}</p>
                        <p>赛程：{{ item.gameTeamCus }} vs {{ item.gameTeamHos }}</p>
                        <p>时间：{{ item.gameTime }}</p>
                        <img v-if="item.status === 0" src="@/assets/images/waitDoing.svg">
                        <img v-if="item.status === 1" src="@/assets/images/accept.svg">
                        <img v-if="item.status === 2" src="@/assets/images/refuse.svg">
                    </n-alert>
                    <template #footer>
                        邀请时间：
                        <n-icon>
                            <Time />
                        </n-icon>
                        {{ item.inviteTime }}
                    </template>
                </n-timeline-item>
            </n-timeline>
            <div class="more__btn">
                <n-button v-if="showMore" type="primary" @click="handleMore" :disabled="moreLoading">
                    <span>查看更多</span><n-spin v-show="moreLoading" stroke="#fff" :size="14" /></n-button>
                <p v-else>到底了！</p>
            </div>
        </div>
    </template>
    <!-- 弹窗 -->
    <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" positive-text="确认"
        negative-text="再想想" @positive-click="onPositiveClick">
        您确定撤销这条邀请记录吗？
    </n-modal>
</template>

<script setup lang='ts'>
import { StopCircle, PersonSharp, Time, LogoXbox } from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
// 声明类型
type Status = 0 | 1 | 2;
interface GameInvitation {
    inviteTime: string,
    inivitePerson: string,
    gameId: number,
    gameTeamCus: string,
    gameTeamHos: string,
    teamCusVote: number,
    teamHosVote: number,
    gameTime: string,
    gameTag: string,
    gameSeason: string,
    gamePlayer: string,
    status: Status
    isFill: boolean
    id: number
}
const message = useMessage();
const loading = ref(false);
const list = ref<GameInvitation[]>([]);

const computedStatus = (status: Status) => {
    const mapList = {
        0: 'info',
        1: 'success',
        2: 'error'
    }
    return mapList[status];
}
const getData = async (page: number, needToReset = false) => {
    try {
        if (list.value.length === 0 || needToReset) {
            list.value = [];
            loading.value = true;
        }
        const req = {
            page,
            limit: 6
        }
        const { data, status } = await getMyInvite(req);
        if (status !== 200) throw new Error('服务端异常');
        if (data.code && data.code !== 200) throw new Error(data?.message ?? '未知错误，请联系网站管理员');
        if(data.code === 200 && !data.data) throw new Error(data.message);
        list.value = list.value.concat(data.data.rows.map(item => {
            return {
                inviteTime: item.create_time,
                inivitePerson: item.invitedChinaname,
                gameId: item.match.id,
                gameTeamCus: item.match.team1_name,
                gameTeamHos: item.match.team2_name,
                teamCusVote: item.match.team1_piaoshu,
                teamHosVote: item.match.team2_piaoshu,
                gameTime: item.match.opentime,
                gameTag: item.match.tag,
                gameSeason: item.match.belong,
                gamePlayer: item.match.referee,
                isFill: JSON.parse(item.match.commentary).length > 2,
                status: item.status ?? 0,
                id: item.id
            }
        }))
        if (data.data.rows.length < 6) {
            showMore.value = false;
        }
    } catch (error) {
        message.error(error.message);
    } finally {
        loading.value = false;
    }

}
getData(1);
const showMore = ref(false);
const moreLoading = ref(false);
const handleMore = () => {
    moreLoading.value = true;
    const page = Math.floor(list.value.length / 6) + 1;
    getData(page);
}
const showModal = ref(false);
const inviteId = ref(null);
const handleRevoke = (id:number)=>{
    showModal.value = true;
    inviteId.value = id
}
const onPositiveClick = async ()=> {
   try {
    const { data, status } = await revokeInvite(inviteId.value);
    if(status !== 200) throw new Error('服务端异常，请联系网站管理员');
    if(data.code && data.code !== 200) throw new Error(data?.message ?? '未知错误，请联系网站管理员');
    message.success('撤销成功！');
    getData(1, true);
   } catch (error) {
    message.error(error.message);
   }
}
</script>
<style scoped lang='scss'>
.main__container {
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main__table {
    padding: 12px;
}

.invite__name {
    font-size: 1.1rem;
    font-weight: bold;
    color: #4090EF;
}

.game__info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    gap: 48px;
    margin: 0 0 12px;

    .asg__tag {
        padding: 3px 12px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        font-size: 13px;
        gap: 12px;

        &.tag--error {
            border: 1px solid rgba(208, 48, 80, 0.23);
            background: #D0305014;
            color: #D03050;
        }

        &.tag--warning {
            border: 1px solid rgba(240, 160, 32, 0.35);
            background: #F0A0201F;
            color: #f0a020;
        }
    }
}

.more__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px;

    p {
        color: #979797;
    }
}

.n__alert--container {
    position: relative;

    img {
        position: absolute;
        right: 12px;
        bottom: 12px;
    }
}
.flex-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>