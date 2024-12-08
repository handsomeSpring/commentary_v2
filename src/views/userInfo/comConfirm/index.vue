<template>
    <nav-back title="解说身份认证" />
    <full-screen-loading v-if="skeleLoading"></full-screen-loading>
    <div class="main__container" v-else>
        <n-card class="card-item" title="解说身份认证">
            <n-gradient-text type="info">
                您的职位是:{{ identify }}
                <span v-show="hasConfirmHis"
                    :style="{ color: model.status === '1' ? '#f0a020' : (model.status === '2' ? '#67c23a' : '#f40') }">
                    （{{ model.status === '0' ? '未申请' : (model.status === '1' ? '申请待审批' : (model.status === '2' ? '申请成功'
                        : (model.status === '3' ?
                            '申请被拒绝' : '您被劝退'))) }}）</span>
            </n-gradient-text>
            <p v-show="userStore.userInfo.officium !== 'Commentator' && model.status === '2'"
                style="color:orange;margin: 6px 0;">
                检测您申请的解说身份已通过，若您的职位不是解说，请联系赛事解说管理人员。
            </p>
            <n-button v-if="model.status === '3'" style="margin-top: 10px;" type="info" size="small"
                @click="handleToEnroll">前往修改申请</n-button>
            <n-button v-if="model.status === '4'" style="margin-top: 10px;" type="info" size="small"
                @click="handleToEnroll">再次申请解说</n-button>
        </n-card>
        <n-card class="card-item" title="解说申请记录">
            <n-form v-if="hasConfirmHis" :model="model" label-placement="left" label-width="auto">
                <n-form-item label="中文名">
                    <n-input v-model:value="model.chinaname" readonly />
                </n-form-item>
                <n-form-item label="历史段位">
                    <n-select v-model:value="model.historyRank" disabled :options="options" placeholder="请选择历史段位"
                        clearable />
                </n-form-item>
                <n-form-item label="游戏ID">
                    <n-input v-model:value="model.gameId" readonly />
                </n-form-item>
                <n-form-item label="联系方式">
                    <n-input v-model:value="model.contactNumber" readonly />
                </n-form-item>
                <n-form-item label="性别">
                    <p>{{ model.sex === 1 ? '男' : '女' }}</p>
                </n-form-item>
                <n-form-item label="自我介绍">
                    <n-input type="textarea" :rows="7" v-model:value="model.introduction" readonly />
                </n-form-item>
            </n-form>
            <n-empty v-else size="large" description="您没有解说申请记录">
                <template #extra>
                    <n-button v-show="userStore.userInfo.officium !== 'Commentator'" size="small" @click="handleJump">
                        前往申请
                    </n-button>
                </template>
            </n-empty>
        </n-card>
    </div>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { useMessage } from 'naive-ui/es/message';
const userStore = useUserStore();
console.log(userStore.userInfo.officium, 'userStore.userInfo.officium');
const message = useMessage();
const identify = ref('');
const options = ref([]);
const hasConfirmHis = ref(false);
const skeleLoading = ref(false);
const router = useRouter();
interface ComForm {
    chinaname?: string,
    userId?: number,
    sex?: number,
    introduction?: string,
    gameId?: string,
    historyRank?: string,
    contactNumber?: string,
    id?: string
    status?: '0' | '1' | '2' | '3' | '4'
}
type Option = {
    value: string
    label: string
}
const model = ref<ComForm>({
    status: '0'
});
const initData = async () => {
    try {
        const { officium, id: userId } = userStore.userInfo;
        skeleLoading.value = true;
        const roleList = await getByCode('roleList');
        identify.value = roleList.data.find(item => item.value === officium)?.label ?? '未知职位';
        const historyRanks = await getByCode('historyRank');
        options.value = historyRanks.data;
        const { data } = await getMyEnrollHis(userId);
        if (data.code !== 200) throw new Error(data.message);
        if (Array.isArray(data.data) && data.data.length > 0) {
            const comAuth = data.data.filter(item => item.biz_type === 'comAuth');
            if (comAuth.length !== 0) {
                const row = comAuth[0];
                Object.assign(model.value, {
                    id: row.id,
                    chinaname: row.chinaname,
                    contactNumber: row.contact_number,
                    gameId: row.game_id,
                    historyRank: row.history_rank,
                    introduction: row.introduction,
                    sex: row.sex,
                    status: row.status,
                    bizType: row.biz_type,
                    reqRole: row.req_role
                });
                hasConfirmHis.value = true;
            } else {
                hasConfirmHis.value = false;
            }
        } else {
            hasConfirmHis.value = false;
        }
    } catch (error) {
        if (error instanceof Error) {
            return message.error(error.message);
        }
        message.error(error.response?.data?.message ?? '服务端异常，请联系网站管理员!');
    } finally {
        skeleLoading.value = false;
    }

}
initData();
const handleToEnroll = () => {
    router.push({ path: '/enroll/details', query: model.value })
}
const handleJump = () => {
    router.push({
        path: '/enroll/details', query: {
            type: 'add'
        }
    })
}
</script>
<style scoped lang='scss'>
.main__container {
    padding: 12px;
    box-sizing: border-box;

    .card-item {
        margin-bottom: 18px;
    }
}
</style>