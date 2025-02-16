<template>
    <nav-back title="响应邀请" />
    <full-screen-loading v-if="loading">
    </full-screen-loading>
    <template v-else>
        <n-alert style="margin:12px" type="warning">
            <template #icon>
                <svg t="1728828125489" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5213" width="28" height="28">
                    <path
                        d="M509.824 874.624c-51.3536 0-94.336-21.76-112.9984-53.632h225.9712c-18.6624 31.8464-61.6448 53.632-112.9728 53.632zM507.5968 142.464c53.2992 0 98.3296 33.7152 110.0288 80.128 97.3312 47.4624 153.088 142.976 153.088 263.936l-0.0768 22.3232c-0.3072 34.432-1.9712 72.3968-11.0592 104.2688 13.5424 8.704 26.6496 20.8128 37.5552 34.944 17.5872 22.4 27.264 46.4384 27.264 67.6352v2.0224c0 60.7744-66.6368 88.448-128.6144 88.448H319.4112c-30.8992 0-59.776-6.8608-81.3824-19.3792-27.648-16.1536-42.8032-41.0112-42.8032-70.0672v-2.048c0-36.3264 26.6496-79.36 60.5696-101.5552-11.3152-40.3712-11.3152-92.8768-11.3152-132.6592 0-118.912 54.3232-209.9968 153.088-257.8432 11.6992-46.4384 56.704-80.1536 110.0288-80.1536z m0 64c-22.7584 0-41.1136 12.416-46.976 28.544l-1.024 3.2512-7.296 28.928-26.8544 13.0304c-76.2368 36.9408-116.9664 105.4464-116.9664 200.2432l0.1024 24.576c0.128 14.08 0.4352 24.32 1.0496 35.072l0.256 4.0704c1.1776 18.5344 3.2512 34.1248 6.2208 46.5664l1.3056 5.12 12.6464 45.1328-39.1936 25.6768c-16.0768 10.496-29.5936 31.744-31.4368 45.0816l-0.2048 2.944v2.0224c0 5.632 2.56 9.8048 10.88 14.6688 9.984 5.8112 25.216 9.8048 42.6496 10.624l6.656 0.1536h376.3712c21.632 0 42.0608-4.864 54.8352-12.4416 6.9888-4.1472 9.216-6.8096 9.7024-10.3936l0.0768-1.6128v-2.0224c0-5.5808-4.3008-16.256-13.9264-28.544-5.12-6.656-11.0592-12.544-16.9984-17.0496l-4.4544-3.1232-40.0128-25.6768 13.056-45.7216c3.328-11.6992 5.6064-26.24 6.9632-43.8528l0.512-7.7312c0.9472-15.7696 1.152-29.0816 1.152-57.472 0-94.08-39.8336-165.504-110.3872-202.9824l-6.7072-3.4048-26.752-13.056-7.2704-28.8256c-4.4544-17.664-23.7056-31.7952-47.9744-31.7952z"
                        fill="#FB553C" p-id="5214"></path>
                    <path
                        d="M558.7712 337.3824a25.6 25.6 0 0 1 36.1984-0.3584c57.9584 56.8832 77.6448 128.6656 58.5472 212.0192a25.6 25.6 0 0 1-49.92-11.4176c15.2064-66.3296 0.512-119.8848-44.4928-164.0448a25.6 25.6 0 0 1-0.3328-36.1984z"
                        fill="#FB553C" p-id="5215"></path>
                </svg>
            </template>
            待处理：有<span class="total__text">{{ total }}</span>名解说邀请您一起参与解说！
        </n-alert>
        <div class="main__container" v-if="list.length === 0">
            <asg-empty description="暂时没有收到邀请">
            </asg-empty>
        </div>
        <div class="main__table" v-else>
            <n-timeline :icon-size="20">
                <n-timeline-item color="#F7A725" line-type="dashed" v-for="(item, index) in list" :key="index">
                    <template #header>
                        <p>邀请人：<span class="invite__name">{{ item.inivitePerson }}</span></p>
                    </template>
                    <template #icon>
                        <n-icon>
                            <StopCircle />
                        </n-icon>
                    </template>
                    <n-alert :show-icon="false" :type="computedStatus(item.status)">
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
                            <div class="asg__tag tag--warning">
                                <n-icon>
                                    <PersonSharp />
                                </n-icon>
                                <P>{{ item.gameJudge }}</P>
                            </div>
                        </div>
                        <p>赛季：{{ item.gameSeason }}</p>
                        <p>赛程：{{ item.gameTeamCus }} vs {{ item.gameTeamHos }}</p>
                        <p>时间：{{ item.gameTime }}</p>
                        <div class="footer__btn">
                            <n-button-group size="small">
                                <n-button :disabled="item.isFill" size="small" type="primary" strong
                                    @click="handleResponse(item, 1)">接受邀请</n-button>
                                <n-button :disabled="item.isFill" type="error" size="small" strong secondary
                                    @click="handleResponse(item, 2)">拒绝邀请</n-button>
                            </n-button-group>
                        </div>
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
    <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" positive-text="确认"
        negative-text="再想想" @positive-click="onPositiveClick">
        {{ confirmInfo }}
    </n-modal>
</template>

<script setup lang='ts'>
import { StopCircle, PersonSharp, Time, LogoXbox } from "@vicons/ionicons5";
import { useMessage } from 'naive-ui';
import { useUserStore } from "@/store/user";
type Status = 0 | 1 | 2;
interface Coms {
    id:number,
    chinaname:string
}
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
    gameJudge:string,
    status: Status,
    isFill: boolean,
    id: number,
    commentary: Coms[]
}
const message = useMessage();
const loading = ref(false);
const showModal = ref(false);
const confirmInfo = ref('');
const reqData = ref({
    id: null,
    status: null,
    gameId: null,
    commentary:[]
});
const list = ref<GameInvitation[]>([]);
const total = ref(0);
const showMore = ref(false);

const userStore = useUserStore();
const computedStatus = (status: Status) => {
    const mapList = {
        '0': 'info',
        '1': 'success',
        '2': 'error'
    }
    return mapList[status];
}
const getData = async (page: number, needToReset = false) => {
    try {
        if (needToReset || list.value.length === 0) {
            list.value = [];
            loading.value = true;
        }
        const req = {
            page,
            limit: 6
        }
        const { data, status } = await getBeInviteData(req);
        if (status !== 200) throw new Error('后端服务器异常');
        if (data.code && data.code !== 200) throw new Error(data?.message ?? '未知错误，请联系网站管理员');
        if (data.code && data.code !== 200) throw new Error(data.message);
        total.value = data?.data?.total ?? 0;
        list.value = list.value.concat((data?.data?.rows ?? []).map(item => {
            return {
                inviteTime: item.create_time,
                inivitePerson: item.invitorChinaname,
                gameId: item.match.id,
                gameTeamCus: item.match.team1_name,
                gameTeamHos: item.match.team2_name,
                teamCusVote: item.match.team1_piaoshu,
                teamHosVote: item.match.team2_piaoshu,
                gameTime: item.match.opentime,
                gameTag: item.match.tag,
                gameSeason: item.match.belong,
                gamePlayer: item.match.referee || '无导播',
                gameJudge:item.match.judge || '无裁判',
                isFill: JSON.parse(item.match.commentary).length > 2,
                commentary:item?.match?.commentary && typeof item.match.commentary === 'string' ? JSON.parse(item.match.commentary) : [],
                status: item.status ?? 0,
                id: item.id
            }
        }))
        if (!data.data || data.data.rows.length < 6) {
            showMore.value = false;
        }
    } catch (error) {
        message.error(error.message);
    } finally {
        loading.value = false;
        moreLoading.value = false;
    }
}
getData(1);
const moreLoading = ref(false);
const handleMore = () => {
    moreLoading.value = true;
    const page = Math.floor(list.value.length / 6) + 1;
    getData(page);
}
type ResponseType = 1 | 2;
const handleResponse = (item: GameInvitation, type: ResponseType) => {
    reqData.value.commentary = (item?.commentary ?? []).map(item => item.id) ?? [];
    reqData.value.id = item.id;
    reqData.value.status = type;
    reqData.value.gameId = item.gameId;
    confirmInfo.value = `您确定${type === 1 ? '接受' : '拒绝'}${item.inivitePerson}对您发起的解说邀请吗？`
    showModal.value = true
}
const onPositiveClick = async () => {
    try {
        const { data, status } = await refuseOrAgreeInv(reqData.value);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
        if (data.code && data.code !== 200) throw new Error(data.message);
        if(reqData.value.commentary.includes(userStore.userInfo.id)){
            message.success('响应成功，由于您已经选了该场比赛，该赛程不会再重复添加您的名单!');
            return;
        }
        if (reqData.value.status === 1) {
            const response = await selectCom(reqData.value.gameId);
            if (response.status !== 200) throw new Error('选班失败，服务端异常，请联系网站管理员');
            message.success('响应成功，并成功选定了班次，请注意比赛开始时间！');
        }else{
            message.success('响应成功，已拒绝该用户的解说邀请！');
        }
    } catch (error) {
        if (
            error instanceof Object
            && 'response' in error
            && error.response instanceof Object
            && 'data' in error.response
            && !!error.response.data
        ) {
            return message.error(`服务端错误：${error.response.data.message}`);
        }
        message.error(error.message);
    } finally{
        getData(1, true);
    }
}
</script>
<style scoped lang='scss'>
.total__text {
    font-size: 1.2rem;
    font-weight: bold;
    color: #4090EF;
    margin: 0 8px;
}

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
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    gap: 1em;
    margin: 0 0 12px;

    .asg__tag {
        padding: 0.2em 0.5em;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        font-size:0.8em;
        gap:0.8em;

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

.footer__btn {
    display: flex;
    justify-content: flex-end;
    margin: 12px 0;
}

.more__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 12px;
}
</style>