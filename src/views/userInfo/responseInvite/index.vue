<template>
    <nav-back title="响应邀请" />
    <full-screen-loading v-if="loading">
    </full-screen-loading>
    <div class="listTable" v-else>
        <div class="alert-tag">
            <img src="../../../assets/images/noticeIcon.png">
            待处理：有<span class="total__text">{{ total }}</span>名解说邀请您一起参与解说！
        </div>
        <div class="main__container" v-if="list.length === 0">
            <asg-empty description="暂时没有收到邀请">
            </asg-empty>
        </div>
        <div class="main__table" v-else>
            <div class="card-container" v-for="(item, index) in list" :key="index">
                <div class="card-header">
                    <div class="time-text">
                        <img src="../../../assets/images/person.png">
                        <p class="person-text">邀请人:<span class="invite-person">{{ item.inivitePerson }}</span></p>
                    </div>
                    <div class="game-tag wait">
                        <n-icon  size="16" color="#DD7D17">
                            <InfiniteSharp />
                        </n-icon>
                        <p>待回应</p>
                    </div>
                </div>
                <div class="tag-card-title">
                    {{ item.gameSeason }}
                </div>
                <div class="card-main">
                    <div class="team-info">
                        <n-avatar round :src="item.customLogo"
                            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                        <p>{{ item.gameTeamCus }}</p>
                    </div>
                    <img class="verse" src="../../../assets/images/VS.png">
                    <div class="team-info">
                        <n-avatar round :src="item.hostLogo"
                            fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                        <p>{{ item.gameTeamHos }}</p>
                    </div>
                </div>
                <div class="card-footer">
                    <li>
                        <div class="left-icon">
                            <img src="../../../assets/images/dateIcon.png">
                            <p>邀请时间</p>
                        </div>
                        <div class="commentary-wrap">
                            {{ handleTime(item.inviteTime) }}
                        </div>
                    </li>
                    <li>
                        <div class="left-icon">
                            <img src="../../../assets/images/gametagBlue.png">
                            <p>赛类</p>
                        </div>
                        <div class="commentary-wrap">
                            {{ item.gameTag || '未定义' }}
                        </div>
                    </li>
                    <li>
                        <div class="left-icon">
                            <img src="../../../assets/images/micro.png">
                            <p>解说</p>
                        </div>
                        <div class="commentary-wrap">
                            <div v-for="(com, index) in item.commentary" :key="index" class="com-tag"
                                :class="!com ? 'no-person' : 'fill-person'">
                                {{ limitText(com, 5, '虚位以待') }}
                            </div>
                        </div>
                    </li>
                    <li v-if="item.personType.includes('judge')">
                        <div class="left-icon">
                            <img src="../../../assets/images/judge.png">
                            <p>裁判</p>
                        </div>
                        <p class="physize-text" :class="!item.gameJudge ? 'none-info' : ''">{{ item.gameJudge || '暂无裁判'
                            }}</p>
                    </li>
                    <li v-if="item.personType.includes('referee')">
                        <div class="left-icon">
                            <img src="../../../assets/images/referee.png">
                            <p>导播</p>
                        </div>
                        <p class="physize-text" :class="!item.gamePlayer ? 'none-info' : ''">{{ item.gamePlayer ||
                            '暂无导播' }}</p>
                    </li>
                    <li>
                        <div class="left-icon">
                            <img src="../../../assets/images/time.png">
                            <p>时间</p>
                        </div>
                        <p class="physize-text">{{ handleTime(item.gameTime) }}</p>
                    </li>
                </div>
                <div class="btn-list-wrap">
                    <div class="my-button" @click="handleResponse(item, 1)">
                        <img src="../../../assets/images/rightIconBlue.png">接受邀请
                    </div>
                    <div class="my-button refuse" @click="handleResponse(item, 2)">
                        <img src="../../../assets/images/refuseIconRed.png">拒绝邀请
                    </div>
                </div>
            </div>
            <div class="more__btn">
                <n-button v-if="showMore" type="primary" @click="handleMore" :disabled="moreLoading">
                    <span>查看更多</span><n-spin v-show="moreLoading" stroke="#fff" :size="14" /></n-button>
                <p v-else>没有更多了~(●'◡'●)</p>
            </div>
        </div>
    </div>
    <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" positive-text="确认"
        negative-text="再想想" @positive-click="onPositiveClick">
        {{ confirmInfo }}
    </n-modal>
</template>

<script setup lang='ts'>
import { useMessage } from 'naive-ui';
import { useUserStore } from "@/store/user";
import { handleTime, limitText } from '@/utils';
import { InfiniteSharp } from "@vicons/ionicons5"
type Status = 0 | 1 | 2;
interface Coms {
    id: number,
    chinaname: string
}
interface GameInvitation {
    inviteTime: string,
    inivitePerson: string,
    gameId: number,
    gameTeamCus: string,
    gameTeamHos: string,
    customLogo: string,
    hostLogo: string,
    gameTime: string,
    gameTag: string,
    gameSeason: string,
    gamePlayer: string,
    gameJudge: string,
    commentary: any[],
    personType: string,
    status: Status
    isFill: boolean
    id: number
}
const message = useMessage();
const loading = ref(false);
const showModal = ref(false);
const confirmInfo = ref('');
const reqData = ref({
    id: null,
    status: null,
    gameId: null,
    commentary: []
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
                customLogo: `https://api.idvasg.cn/loge/${item.match.belong}/${item.match.team1_name}.png`,
                hostLogo: `https://api.idvasg.cn/loge/${item.match.belong}/${item.match.team2_name}.png`,
                gameTime: item.match.opentime,
                gameTag: item.match.tag,
                gameSeason: item.match.belong,
                gamePlayer: item.match.referee,
                gameJudge: item.match.judge,
                personType: item.match.person_type,
                commentary: constructorComs(item.match.commentary, item.match.com_limit),
                isFill: JSON.parse(item.match.commentary).length >= item.match.com_limit,
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
const constructorComs = (commentary: string, number: number) => {
    const comArr = JSON.parse(commentary);
    let result = [];
    for (let i = 0; i < number; i++) {
        result[i] = comArr[i]?.chinaname ?? '';
    }
    return result;
}
const onPositiveClick = async () => {
    try {
        loading.value = true;
        const { data, status } = await refuseOrAgreeInv(reqData.value);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
        if (data.code && data.code !== 200) throw new Error(data.message);
        if (reqData.value.commentary.includes(userStore.userInfo.id)) {
            message.success('响应成功，由于您已经选了该场比赛，该赛程不会再重复添加您的名单!');
            return;
        }
        if (reqData.value.status === 1) {
            const response = await selectCom(reqData.value.gameId);
            if (response.status !== 200) throw new Error('选班失败，服务端异常，请联系网站管理员');
            message.success('响应成功，并成功选定了班次，请注意比赛开始时间！');
        } else {
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
    } finally {
        getData(1, true);
        loading.value = false;
    }
}
</script>
<style scoped lang='scss'>
.listTable {
    padding: 12px;
    min-height: calc(100dvh - 69px);
    background: var(--main-bg-color);

    .main__container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .alert-tag {
        height: 36px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        background: #E7FFEF;
        border: 1px solid #105126;
        border-radius: 4px;
        color: #333;
        font-size: 14px;
        gap: 6px;

        .total__text {
            font-weight: bold;
            color: #F40;
        }
    }

    .main__table {
        height: 100%;

        //卡片开始
        .card-container {
            border-radius: 16pt;
            padding: 12px;
            margin: 12px auto;
            background: #fff;

            .card-header {
                height: 32px;
                border-bottom: 1px solid #D3E8DA;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .time-text {
                    display: flex;
                    align-items: center;
                    gap: 2px;

                    .person-text {
                        font-weight: 400;
                        font-size: 14px;
                        color: #808080;

                        .invite-person {
                            color: #105126;
                        }
                    }
                }

                .game-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    padding: 1px 4px;
                    border-radius: 4px;

                    p {
                        font-size: 13px;
                    }

                    &.wait {
                        background: #FFDCB7;

                        p {
                            color: #DD7D17
                        }
                    }

                    &.error {
                        background: #FFCBCB;
                        color: #511010;
                    }

                    &.success {
                        background: #CAE5D3;
                        color: #105126
                    }
                }
            }

            // title部分
            .tag-card-title {
                font-weight: 500;
                font-size: 16px;
                color: #105126;
                line-height: 16px;
                text-align: center;
                margin: 12pt 0;
            }

            // 主体战队部分
            .card-main {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 5em;
                gap: 55pt;
                padding-bottom: 17pt;

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

                        .com-tag {
                            padding: 2px 6px;
                            font-size: 14px;
                            border-radius: 6px;

                            &.no-person {
                                color: #1070AB;
                                background: #BCD9EB;
                            }

                            &.fill-person {
                                color: #EF2D2D;
                                background: #FFC8C8;
                            }
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
                    color: #1070AB;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;

                    &.refuse {
                        color: #FF2020;
                        background: #FFC0C0;
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

    .more__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 22px;

        p {
            color: var(--main-theme-text);
        }
    }
}
</style>