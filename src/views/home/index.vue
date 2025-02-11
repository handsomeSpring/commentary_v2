<template>
    <nor-header title="赛程中心" activeMenu="1">
        <full-screen-loading v-if="loading"></full-screen-loading>
        <div class="main-body" v-else>
            <div class="header-search-container">
                <n-select v-model:value="season" :options="options" placeholder="请选择赛季" @update:value="handleSelect" />
            </div>
            <asg-empty v-if="tableData.length === 0" description="该赛季暂无赛程信息，请联系赛事主办方。">
            </asg-empty>
            <div v-else  class="listTable">
                <n-infinite-scroll style="height: 100%" :distance="10" @load="handleLoad">
                    <div class="card-container" v-for="(item, index) in tableData" :key="index">
                        <div class="card-header">
                            <p class="time-text" :class="item.isOver ? 'time-over' : 'time-process'">{{ item.isOver ?
                                '赛程已结束' : '赛程进行中' }}
                            </p>
                            <div class="game-tag">
                                <img src="../../assets/images/gametag.png">
                                <p>{{ item.tag || '未定义' }}</p>
                            </div>
                        </div>
                        <div class="card-main">
                            <div class="team-info">
                                <n-avatar round :src="item.customLogo"
                                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                                <p>{{ item.team1_name }}</p>
                            </div>
                            <img class="verse" src="../../assets/images/VS.png">
                            <div class="team-info">
                                <n-avatar round :src="item.hostLogo"
                                    fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                                <p>{{ item.team2_name }}</p>
                            </div>
                        </div>
                        <div class="card-footer">
                            <li>
                                <div class="left-icon">
                                    <img src="../../assets/images/micro.png">
                                    <p>解说</p>
                                </div>
                                <div class="commentary-wrap">
                                    <div v-for="(com, index) in item.commentary" :key="index" class="com-tag"
                                        :class="!com ? 'no-person' : 'fill-person'">
                                        {{ setName(com) }}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div class="left-icon">
                                    <img src="../../assets/images/judge.png">
                                    <p>裁判</p>
                                </div>
                                <p class="physize-text" :class="!item.judge ? 'none-info' : ''">{{ item.judge || '暂无裁判'
                                    }}</p>
                            </li>
                            <li>
                                <div class="left-icon">
                                    <img src="../../assets/images/referee.png">
                                    <p>导播</p>
                                </div>
                                <p class="physize-text" :class="!item.referee ? 'none-info' : ''">{{ item.referee ||
                                    '暂无导播' }}</p>
                            </li>
                            <li>
                                <div class="left-icon">
                                    <img src="../../assets/images/time.png">
                                    <p>时间</p>
                                </div>
                                <p class="physize-text">{{ handleTime(item.opentime) }}</p>
                            </li>
                        </div>
                        <div class="btn-list-wrap" v-if="item.isAllowChoose === 1">
                            <div class="my-button" @click="selectGames(item)"
                                :class="computedDisBtn(item.isOver, item.commentary) ? 'disabled' : ''">
                                {{ computedDisBtn(item.isOver, item.commentary) ? '无法报名' :
                                    '解说该场' }}
                            </div>
                            <div class="my-button" @click="inviteCom(item)"
                                :class="computedDisBtn(item.isOver, item.commentary) ? 'disabled' : ''"
                                :disabled="computedDisBtn(item.isOver, item.commentary)">{{
                                    computedDisBtn(item.isOver, item.commentary) ? '无法邀请' : '邀请解说' }}
                            </div>
                        </div>
                        <div v-else class="forbid-choose-text">该场赛程，主办方设置了不可选班模式!</div>
                    </div>
                    <div v-if="listLoading" class="text">
                        加载中...
                    </div>
                    <div v-if="noMore" class="text">
                        没有更多了
                    </div>
                </n-infinite-scroll>
            </div>
        </div>
    </nor-header>
    <!-- 挂在在body的弹窗部分 -->
    <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" positive-text="确认"
        negative-text="算了" @positive-click="onPositiveClick" @negative-click="onNegativeClick">
        {{ confirmInfo }}
    </n-modal>
    <comPersonChoose v-model:visible="inviteShow" @finishChoose="handleInvite"></comPersonChoose>
</template>

<script setup lang='ts'>
import comPersonChoose from '@/components/common/comPersonChoose.vue';
import { useMessage } from 'naive-ui';
import { selectCom } from "@/api/commentary"
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
// 接口定义开始
interface GameInterface {
    belong: string
    bilibiliurl?: string
    commentary: string | any[]
    id: number
    opentime: string
    referee?: string
    tag?: string
    team1_name: string
    team2_name: string
    team1_piaoshu: number
    team2_piaoshu: number
    winteam?: string
    com_limit: 1 | 2 | 3
    judge?: string
    person_type?: string
    commentaryIds: number[]
    customLogo: string
    hostLogo: string
    isAllowChoose: 0 | 1
}
interface GameTable extends GameInterface {
    isOver: boolean
    commentary: any[]
}
// 接口定义结束
const nMessage = useMessage();
const season = ref("");
const loading = ref(false);
const showModal = ref(false); //showModal 解说提示弹窗
const confirmInfo = ref('');
const pageQuery = ref({
    page: 1,
    limit: 5
})
const tableData = ref([]);
let options = [];
const listLoading = ref(false);
const noMore = ref(false);

const setName = (com:(string | undefined)) => {
    if(!com) return '虚位以待';
    if(com.length > 5) return `${com.slice(0,5)}..`;
    return com;
}
const getSeason = async () => {
    loading.value = true;
    const { data, status } = await getAllEvents();
    if (status !== 200) throw new Error(data.messsage);
    options = data.map((item: any) => {
        return {
            ...item,
            label: item.name,
            value: item.name
        }
    });
    const noOverArr = options.filter(item => !item.is_over);
    season.value = window.sessionStorage.getItem('seasonName') || noOverArr[0].value || options[0].value;
    getGames();
};
getSeason();
const getGames = async () => {
    try {
        const params = {
            ...pageQuery.value,
            belong: season.value
        }
        const { data, status } = await getAllGames(params);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理');
        if (data.length < 5) {
            noMore.value = true;
        }
        tableData.value = data.map(item => {
            return {
                ...item,
                personType: item.person_type || 'referee,commentary',
                isOver: new Date() > new Date(item.opentime),
                commentary: constructorComs(item.commentary, item.com_limit),
                commentaryIds: constructorComsId(item.commentary),
                customLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team1_name}.png`,
                hostLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team2_name}.png`,
            }
        });
    } catch (error) {
        nMessage.error(error instanceof Error ? error.message : '服务端错误，请联系网站管理员。');
    } finally {
        loading.value = false;
    }
}
const constructorComsId = (commentary: string) => {
    const comArr = JSON.parse(commentary);
    return Array.isArray(comArr) ? comArr.map(item => item.id) : [];
}
const constructorComs = (commentary: string, number: number) => {
    const comArr = JSON.parse(commentary);
    let result = [];
    for (let i = 0; i < number; i++) {
        result[i] = comArr[i]?.chinaname ?? '';
    }
    return result;
}
const handleLoad = async () => {
    try {
        if (listLoading.value || noMore.value) {
            return;
        }
        listLoading.value = true;
        pageQuery.value.page++;
        const params = {
            ...pageQuery.value,
            belong: season.value
        }
        const { data, status } = await getAllGames(params);
        setTimeout(() => {
            listLoading.value = false;
            if (data.length === 0) {
                noMore.value = true;
                return;
            }
            if (status !== 200) throw new Error('服务端异常,请联系网站管理员');
            tableData.value = [...tableData.value, ...data.map(item => {
                return {
                    ...item,
                    personType: item.person_type || 'referee,commentary',
                    isOver: new Date() > new Date(item.opentime),
                    commentary: constructorComs(item.commentary, item.com_limit),
                    commentaryIds: constructorComsId(item.commentary),
                    customLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team1_name}.png`,
                    hostLogo: `https://api.idvasg.cn/loge/${item.belong}/${item.team2_name}.png`,
                }
            })];
        }, 800);
    } catch (error) {
        nMessage.error(error.message);
    }
}
const handleSelect = (e: string) => {
    loading.value = true;
    noMore.value = false;
    pageQuery.value.page = 1;
    season.value = e;
    window.sessionStorage.setItem('seasonName', e);
    getGames();
}
// 辅助函数
const handleTime = (value: string) => {
    const year = new Date(value).getFullYear();
    const month = new Date(value).getMonth() + 1;
    const day = new Date(value).getDate();
    const hour = new Date(value).getHours();
    const min = new Date(value).getMinutes();
    return year + '年' + month + '月' + day + '日 ' + hour + '时' + min + '分';
};
const computedDisBtn = (isOver: boolean, commentary: any[]) => {
    if (isOver) {
        return true;
    } else {
        return commentary.every(item => Boolean(item));
    }
}


const gameId = ref(null);
// 模态窗取消方法
const onNegativeClick = () => {
    showModal.value = false;
}
// 模态框确认的方法
const onPositiveClick = async () => {
    showModal.value = false;
    try {
        loading.value = true;
        const { status,data } = await selectCom(gameId.value);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
        if(data.code && data.code !== 200) throw new Error(data.message ?? '服务端错误！');
        nMessage.success('选班成功,请前往个人主页查看');
        getGames();
    } catch (error) {
        if (error.response?.data?.code === 400) {
            nMessage.error('选班失败，您不是解说');
            return;
        }
        nMessage.error(error instanceof Error ? error.message : '未知错误，请联系网站管理员！');
    } finally {
        loading.value = false;
    }

}
// selectGames 
const selectGames = (item: GameTable) => {
    if (computedDisBtn(item.isOver, item.commentary)) return;
    if (item.commentaryIds.includes(userStore.userInfo.id)) return nMessage.warning('您已经报名解说这场比赛了，请勿重复操作');
    confirmInfo.value = `您是否确认解说${item.belong}${item.tag || ''}的${item.team1_name}对战${item.team2_name}的比赛？`;
    showModal.value = true;
    gameId.value = item.id;

}
// 邀请解说功能
const inviteShow = ref(false);
const inviteGame = ref<number | null>(null)
const inviteCom = (item: GameTable) => {
    if (computedDisBtn(item.isOver, item.commentary)) return;
    inviteGame.value = item.id;
    inviteShow.value = true;
}
const handleInvite = async (userId: number) => {
    try {
        loading.value = true;
        if (userId === userStore.userInfo.id) throw new Error('您不能邀请自己。');
        const req = {
            invitedId: userId,
            matchId: inviteGame.value
        }
        const { status, data } = await inviteUser(req);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理人员');
        if (data.code && data.code !== 200) throw new Error(data.message);
        nMessage.success('邀请成功，请前往我的邀请查看。');
    } catch (error) {
        nMessage.error(error.message)
    } finally {
        loading.value = false;
    }
}
</script>
<style scoped lang='scss'>
.header-search-container {
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 52px;
    width: calc(100% - 24px);
    z-index: 2;
    padding: 0 12px;
    background: #e8e8f3;
}

.main-body {
    background: #f0f4f8;
    height: 100%;
}

.listTable {
    padding: 58px 12px 12px;
    min-height: calc(100% - 96px);
    background: url('../../assets/images/listBg.png');
    background-size: cover;
    position: relative;
    z-index: 1;

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