<template>
    <nor-header title="赛程中心" activeMenu="1">
        <full-screen-loading v-if="loading"></full-screen-loading>
        <div class="main-body" v-else>
            <div class="header-search-container">
                <n-select v-model:value="season" :options="options" placeholder="请选择赛季" @update:value="handleSelect" />
            </div>
            <div class="listTable">
                <n-empty v-if="tableData.length === 0" description="该赛季暂无赛程信息，请联系赛事主办方。">
                </n-empty>
                <n-infinite-scroll v-else style="height: 100%" :distance="10" @load="handleLoad">
                    <n-timeline>
                        <n-timeline-item v-for="(item, index) in tableData" :key="index"
                            :type="computedType(item.opentime, item.winteam)">
                            <template #header>
                                {{ handleTime(item.opentime) }}
                                <span class="time__text" :class="[
                                    item.isOver ? 'over' : 'process'
                                ]"> <n-gradient-text :size="16" :type="item.isOver ? 'error' : 'success'">{{
                                    item.isOver ? '赛程已结束' : '赛程进行中' }}</n-gradient-text></span>
                            </template>
                            <n-card>
                                <template #header>
                                    <div class="header_info">
                                        <div class="team-info">
                                            <n-avatar round :src="item.customLogo"
                                                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                                            <p>
                                                <n-gradient-text :size="16" type="info">{{ item.team1_name
                                                    }}</n-gradient-text>
                                            </p>
                                        </div>
                                        <p class="verse">
                                            <n-gradient-text type="warning">
                                                vs
                                            </n-gradient-text>
                                        </p>
                                        <div class="team-info">
                                            <n-avatar round :src="item.hostLogo"
                                                fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"></n-avatar>
                                            <p>
                                                <n-gradient-text :size="16" type="error">{{ item.team2_name
                                                    }}</n-gradient-text>
                                            </p>
                                        </div>
                                    </div>
                                </template>
                                <div class="divider"></div>
                                <div class="grid-line" v-if="item.personType.includes('commentary')">
                                    <div class="one_tag" v-for="(com, index) in item.commentary" :key="index">
                                        <n-tag :type="!com ? 'success' : 'error'" size="small">
                                            <n-icon size="12" style="margin-right: 1px;">
                                                <ExtensionPuzzle v-if="!com" />
                                                <PersonSharp v-else />
                                            </n-icon>
                                            解说
                                        </n-tag>
                                        <p class="name_info" :class="!com ? 'no-person' : 'fill-person'">
                                            {{ com || '位置空缺' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="grid-line">
                                    <div class="one_tag" v-if="item.personType.includes('judge')">
                                        <n-tag type="info" size="small">
                                            <n-icon size="12" style="margin-right: 1px;">
                                                <PersonSharp />
                                            </n-icon>
                                            裁判
                                        </n-tag>
                                        <p class="name_info">{{ item.judge || '暂无裁判' }}</p>
                                    </div>
                                    <div class="one_tag" v-if="item.personType.includes('referee')">
                                        <n-tag type="info" size="small">
                                            <n-icon size="12" style="margin-right: 1px;">
                                                <PersonSharp />
                                            </n-icon>
                                            导播
                                        </n-tag>
                                        <p class="name_info">
                                            {{ item.referee || '暂无导播' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="btn-container-footer" v-if="item.personType.includes('commentary')">
                                    <div class="footer__line">
                                        <n-tag type="warning" size="small">
                                            <n-icon size="11" style="margin-right: 0.5em;">
                                                <PricetagsSharp />
                                            </n-icon>
                                            {{ item.tag || '未定义' }}
                                        </n-tag>
                                    </div>
                                    <n-button-group size="small" v-if="item.isAllowChoose === 1">
                                        <n-button size="small" type="primary" strong @click="selectGames(item)"
                                            :disabled="computedDisBtn(item.isOver, item.commentary)">
                                            {{ computedDisBtn(item.isOver, item.commentary) ? '无法报名' :
                                                '解说该场' }}
                                        </n-button>
                                        <n-button type="default" size="small" @click="inviteCom(item)"
                                            :disabled="computedDisBtn(item.isOver, item.commentary)">邀请解说</n-button>
                                    </n-button-group>
                                </div>
                            </n-card>
                            <template #footer>
                                <div class="for-bid" v-if="item.isAllowChoose === 0">
                                    <n-icon size="16" color="#f40">
                                        <BanSharp></BanSharp>
                                    </n-icon>
                                    <span class="forbid-choose-text">该场赛程，主办方设置了不可选班模式!</span>
                                </div>
                            </template>
                        </n-timeline-item>
                    </n-timeline>
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
    <!-- <invite-choose v-model:visible="inviteShow"  @finishChoose="handleInvite"></invite-choose> -->
</template>

<script setup lang='ts'>
import comPersonChoose from '@/components/common/comPersonChoose.vue';
import { useMessage } from 'naive-ui';
import { PersonSharp, PricetagsSharp, ExtensionPuzzle, BanSharp } from "@vicons/ionicons5";
import { selectCom } from "@/api/commentary"

import { useUserStore } from '@/store/user';

const userStore = useUserStore();
// 接口定义开始
interface GameInterface {
    belong: string
    bilibiliurl?: string
    commentary: string
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
// const computedCommentary = (value: string) => {
//     if (!value) {
//         return []
//     } else {
//         if (isJSON(value)) {
//             return JSON.parse(value).map(item => item.chinaname);
//         } else {
//             return ['无法解析JSON', '无法解析JSON'];
//         }
//     }
// }
const computedDisBtn = (isOver: boolean, commentary: any[]) => {
    if (isOver) {
        return true;
    } else {
        return commentary.every(item => Boolean(item));
    }
}
const computedType = (time: string, winteam: string | null) => {
    if (new Date() < new Date(time)) {
        return 'success';
    } else {
        return !!winteam ? 'error' : 'warning';
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
        const { status } = await selectCom(gameId.value);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
        nMessage.success('选班成功,请前往个人主页查看');
        getGames();
    } catch (error) {
        if (error.response?.data?.code === 400) {
            nMessage.error('选班失败，您不是解说');
            return;
        }
        nMessage.error(error instanceof Error ? error?.response?.data?.message : error.customMessage);
    } finally {
        loading.value = false;
    }

}
// selectGames 
const selectGames = (item: GameInterface) => {
    if (item.commentaryIds.includes(userStore.userInfo.id)) return nMessage.warning('您已经报名解说这场比赛了，请勿重复操作');
    confirmInfo.value = `您是否确认解说${item.belong}${item.tag || ''}的${item.team1_name}对战${item.team2_name}的比赛？`;
    showModal.value = true;
    gameId.value = item.id;

}
// 邀请解说功能
const inviteShow = ref(false);
const inviteGame = ref<number | null>(null)
const inviteCom = (item: GameInterface) => {
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
.for-bid {
    display: flex;
    align-items: center;
    gap:0.5em;
    margin:0.5em;
    .forbid-choose-text {
        font-size: 1em;
        color: #f40;
    }
}


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

.listTable {
    padding: 84px 12px 12px;
    min-height: calc(100% - 96px);
    background: url('../../assets/images/listBg.png');
    background-size: cover;
    position: relative;
    z-index: 1;
}

.divider {
    height: 3px;
    width: 100%;
    border-radius: 5px 5px 0 0;
    background: linear-gradient(173deg, #B3D4FF 0%, rgba(255, 255, 255, 0) 93%);
}

.grid-line {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
    margin: 1em 0;

    .one_tag {
        display: flex;
        align-items: center;

        .name_info {
            width: 6em;
            margin-left: 0.4em;
            font-size: 0.9em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &.no-person {
                color: #429F46
            }

            &.fill-person {
                color: #f40;
            }
        }
    }

}

.btn-container-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
    gap: 0.7em;
}

.main-body {
    background: #f0f4f8;
    height: 100%;
}

.n-card {
    background: transparent;
    border-color: #e8e8f3;
    background-color: #fff;
    border-radius: 8px !important;
}

.text {
    text-align: center;
    margin: 24px 0;
    color: #a7a7a7;
}

.footer__line {
    display: flex;
    align-items: center;
}

.time__text {
    font-size: 1rem;
    margin-left: 12px;
    font-weight: bold;
    font-style: italic;

    &.over {
        color: #f40;
    }

    &.process {
        color: #429F46;
    }
}

.header_info {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .verse {
        font-size: 1.5em;
        font-weight: bold;
    }

    .team-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.6em;
        width: 30%;

        img {
            width: 4em;
            height: 4em;
        }
    }
}
</style>