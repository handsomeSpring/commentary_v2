<template>
    <nav-back title="解说身份认证" />
    <n-skeleton v-if="skeleLoading" width="100%" height="250px" :sharp="false" size="medium" />
    <div class="main__container" v-else>
        <n-card class="card-item" title="解说身份认证">
            <n-gradient-text type="info">
                您的身份是:{{ identify ? '解说' : '普通人员' }}
                <span :style="{ color: model.status === '1' ? '#f0a020' : (model.status === '2' ? '#67c23a' : '#f40') }" v-show="!identify">
                    （{{ model.status === '1' ? '申请待审批' : (model.status === '2' ? '申请成功' : (model.status === '3' ? '申请被拒绝': '您被劝退')) }}）</span>
            </n-gradient-text>
            <p v-show="userStore.userInfo.officium !== 'Commentator' && model.status === '2'"  style="color:orange;margin: 6px 0;">
                职位在后台完成更新，请尝试重新登录
            </p>
            <n-button v-if="!identify && model.status === '3'" style="margin-top: 10px;" type="info" size="small" @click="handleJump">前往修改申请</n-button>
            <n-button v-if="!identify && model.status === '4'" style="margin-top: 10px;" type="info" size="small" @click="handleJump">再次申请解说</n-button>
        </n-card>
        <n-card class="card-item" title="解说申请记录">
            <n-form v-if="hasConfirmHis" :model="model" label-placement="left" label-width="auto">
                <n-form-item label="中文名">
                    <n-input v-model:value="model.chinaname" readonly />
                </n-form-item>
                <n-form-item label="历史段位">
                    <n-input v-model:value="model.historyRank" readonly />
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
                    <n-button size="small" v-if="!identify" @click="handleJump">
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
console.log(userStore.userInfo.officium,'userStore.userInfo.officium');
const message = useMessage();
const identify = ref(false);
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
const model = ref<ComForm>({});
const initData = async () => {
    try {
        const { officium, id: userId } = userStore.userInfo;
        skeleLoading.value = true;
        const { data } = await getMyEnrollHis(userId);
        if(data.code !== 200) throw new Error(data.message);
        if (Array.isArray(data.data) && data.data.length > 0) {
            const row = data.data[0];
            Object.assign(model.value, {
                id: row.id,
                chinaname: row.chinaname,
                contactNumber: row.contact_number,
                gameId: row.game_id,
                historyRank: row.history_rank,
                introduction: row.introduction,
                sex: row.sex,
                status:row.status
            });
            hasConfirmHis.value = true;
            const result = await getByCode('historyRank');
            if (result.data && Array.isArray(result.data)) {
                model.value.historyRank = result.data.find((option: Option) => option.value === model.value.historyRank)?.label ?? '未知段位';
            }
        } else {
            hasConfirmHis.value = false;
        }
        identify.value = officium === 'Commentator';
    } catch (error) {
        if(error instanceof Error){
            return message.error(error.message);
        }
        message.error(error.response?.data?.message ?? '服务端异常，请联系网站管理员');
    } finally {
        skeleLoading.value = false;
    }

}
initData();
const handleJump = ()=>{
    router.push({ path:'/enroll' })
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