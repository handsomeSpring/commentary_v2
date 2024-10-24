<template>
    <nor-header title="赛程中心" activeMenu="1">
        <div class="main-body">
            <div class="header-search-container">
                <n-select v-model:value="season" :options="options" placeholder="请选择赛季" clearable
                    @update:value="handleSelect" />
            </div>
            <div class="listTable">
                <template v-if="loading">
                    <n-skeleton text :repeat="4" />
                    <n-skeleton text style="width: 87%" :repeat="2" />
                    <n-skeleton text style="width: 70%" :repeat="2" />
                    <n-skeleton text style="width: 50%" />
                </template>
                <template v-else>
                    <n-empty v-if="tableData.length === 0" description="暂无赛季信息，请联系赛事主办方。">
                    </n-empty>
                    <n-infinite-scroll v-else style="height: 100dvh" :distance="10" @load="handleLoad">
                        <n-timeline>
                            <n-timeline-item v-for="(item, index) in tableData" :key="index"
                                :type="computedType(item.opentime, item.winteam)">
                                <template #header>
                                    {{ item.tag }}
                                    <span class="time__text" :class="[
                                        item.isOver ? 'over' : 'process'
                                    ]">{{ item.isOver ? '赛程已结束' : '赛程进行中' }}</span>
                                </template>
                                <template #footer>
                                    <div class="footer__line">
                                        <n-icon size="13" style="margin-right: 3px;">
                                            <Time />
                                        </n-icon>
                                        {{ handleTime(item.opentime) }}
                                    </div>
                                </template>
                                <n-card style="background-color: #fff;">
                                    <template #header>
                                        <n-gradient-text type="info">
                                            {{ item.team1_name }}
                                        </n-gradient-text>
                                        <span style="margin:0 12px;">
                                            <n-gradient-text type="warning">
                                                vs
                                            </n-gradient-text>
                                        </span>
                                        <n-gradient-text type="error">
                                            {{ item.team2_name }}
                                        </n-gradient-text>
                                    </template>
                                    <div class="between-com" v-if="item.personType.includes('commentary')">
                                        <div class="asg__tag--p" v-for="(com, index) in item.commentary" :key="index"
                                            :class="!!com ? 'tag--error' : 'tag--success'">
                                            <n-icon size="14" style="margin-right: 3px;">
                                                <PersonSharp v-if="!!com" />
                                                <ExtensionPuzzle v-else />
                                            </n-icon>
                                            {{ com || '位置空缺' }}
                                        </div>
                                    </div>
                                    <n-divider />
                                    <div style="display: flex; align-items: center;justify-content: space-between;">
                                        <div v-if="item.personType.includes('judge')"><n-tag style="margin-right: 6px;"
                                                type="error">裁判</n-tag> {{
                                            item.judge || '无裁判'}}</div>
                                        <div v-if="item.personType.includes('referee')"><n-tag
                                                style="margin-right: 6px;" type="info">导播</n-tag> {{
                                            item.referee }}</div>
                                    </div>
                                    <div class="btn-container-footer" v-if="item.personType.includes('commentary')">
                                        <n-button-group size="small">
                                            <n-button size="small" type="primary" strong
                                                @click="selectGames(item)"
                                                :disabled="computedDisBtn(item.isOver, item.commentary)">
                                                {{ computedDisBtn(item.isOver, item.commentary) ? '无法报名' :
                                                    '解说该场' }}
                                            </n-button>
                                            <n-button type="default" size="small" @click="inviteCom(item)"
                                                :disabled="computedDisBtn(item.isOver, item.commentary)">邀请解说</n-button>
                                        </n-button-group>
                                    </div>
                                </n-card>
                            </n-timeline-item>
                        </n-timeline>
                        <div v-if="listLoading" class="text">
                            加载中...
                        </div>
                        <div v-if="noMore" class="text">
                            没有更多了
                        </div>
                    </n-infinite-scroll>
                </template>
            </div>
        </div>
    </nor-header>
    <!-- 挂在在body的弹窗部分 -->
    <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" title="确认" positive-text="确认"
        negative-text="算了" @positive-click="onPositiveClick" @negative-click="onNegativeClick">
        {{ confirmInfo }}
    </n-modal>
    <invite-choose v-model:visible="inviteShow" :treeList="roleList" @finishChoose="handleInvite"></invite-choose>
</template>

<script setup lang='ts'>
import InviteChoose from '@/components/home/InviteChoose.vue';
import { useMessage } from 'naive-ui';
import { PersonSharp, Time, ExtensionPuzzle } from "@vicons/ionicons5";
import { selectCom } from "@/api/commentary"
import { getUsersWithRole } from '@/api/common';
import { getByCode } from "@/api/common";
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
    com_limit:1 | 2 | 3
    judge?:string
    person_type?:string
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
const roleList = ref([]);

const roleMap = ref([]);
const initRoleMap = async () => {
    const { data } = await getByCode('roleList');
    roleMap.value = data;
}

interface Role {
    chinaname: string
    email?: string
    id: number
    officium: string
    userName: string
}
const createTreeData = (arr) => {
    if (!arr) {
        roleList.value = [];
        return;
    }
    arr.forEach((parent) => {
        const obj = {
            label: roleMap.value.find(item => item.value === parent[0].officium)?.label ?? '未知职位',
            key: parent[0].officium,
            checkboxDisabled: true,
            children: []
        };
        const child = parent.map((child: Role) => {
            return {
                label: child.chinaname,
                key: child.id,
                disabled: child.officium !== 'Commentator',
            }
        })
        obj.children = child;
        roleList.value.push(obj);
    });

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
    season.value = window.sessionStorage.getItem('seasonName') || options[0].value;
    getGames();
    const result = await getUsersWithRole();
    await initRoleMap();
    createTreeData(result.data);
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
                personType:item.person_type || 'referee,commentary',
                isOver: new Date() > new Date(item.opentime),
                commentary: constructorComs(item.commentary, item.com_limit)
            }
        });
    } catch (error) {
        nMessage.error(error instanceof Error ? error.message : '服务端错误，请联系网站管理员。');
    } finally {
        loading.value = false;
    }
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
                    personType:item.person_type || 'referee,commentary',
                    isOver: new Date() > new Date(item.opentime),
                    commentary: constructorComs(item.commentary, item.com_limit)
                }
            })];
        }, 1000);
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
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
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
const computedDisBtn = (isOver:boolean, commentary:any[]) => {
    if (isOver) {
        return true;
    } else {
        return commentary.every(item => Boolean(item));
    }
}
const computedType = (time: string, winteam: string | null) => {
    if (new Date() < new Date(time)) {
        return 'info';
    } else {
        return !!winteam ? 'error' : 'success';
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
    if (item.commentary.includes(userStore.userInfo.chinaname)) return nMessage.warning('您已经报名解说这场比赛了，请勿重复操作');
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
const handleInvite = async (person: number[]) => {
    try {
        if (!Array.isArray(person) || person.length === 0) throw new Error('邀请数据错误');
        const invitedId = person.at(-1);
        if (invitedId === userStore.userInfo.id) throw new Error('您不能邀请自己。');
        const req = {
            invitedId,
            matchId: inviteGame.value
        }
        const { status, data } = await inviteUser(req);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理人员');
        if (data.code && data.code !== 200) throw new Error(data.message);
        nMessage.success('邀请成功，请前往我的邀请查看。');
    } catch (error) {
        nMessage.error(error.message)
    }

}
</script>
<style scoped lang='scss'>
.header-search-container {
    padding: 12px 0;
    width: 95%;
    margin: 0 auto;
}

.listTable {
    width: 95%;
    margin: 6px auto;
    min-height: 100dvh;
}


.between-com {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px 36px;
    align-items: center;

    .asg__tag--p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: calc(100% - 24px);
        font-size: 14px;
        padding: 3px 12px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        &.tag--error {
            background: #F9E7E5;
            color: #FF3C00;
        }

        &.tag--success {
            color: #429F46;
            background: #E6F3E7
        }
    }

    // .name {
    //     display: inline-block;
    //     width: 21vw;
    //     white-space: nowrap;
    //     text-overflow: ellipsis;
    //     overflow: hidden;
    // }
}

.btn-container-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
}

.main-body {
    background: #f0f4f8;
}

.n-card {
    background: transparent;
    border-color: #e8e8f3;
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
.time__text{
    font-size: 1rem;
    margin-left:12px;
    font-weight: bold;
    font-style: italic;
    &.over{
        color:#f40;
    }
    &.process{
        color:#429F46;
    }
}
</style>