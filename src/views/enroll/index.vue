<template>
    <nor-header title="解说报名" activeMenu="3">
        <div v-if="pageType === 'enroll'" class="card__box">
            <n-alert style="margin-bottom:12px" v-if="comStatus !== '0' && pageType === 'enroll'" title="提示" :type="computedComType(comStatus)">
                {{ computedStatus(comStatus) }}
            </n-alert>
            <n-card>
                <template #header>
                    <p class="header__text" style="--text:'成为ASG解说'"></p>
                </template>
                <n-form ref="formRef" :model="model" :rules="rules" size="small" label-placement="top">
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="申请业务" path="historyRank">
                            <n-select v-model:value="model.bizType" disabled :options="bizTypeOptions"
                                placeholder="请选择申请业务" />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="圈名" path="chinaname">
                            <n-input v-model:value="chinaname" readonly placeholder="圈名" />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="第五人格Id" path="gameId">
                            <n-input v-model:value="model.gameId" :readonly="waitAuth" placeholder="请输入第五人格Id"
                                clearable />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="历史段位" path="historyRank">
                            <n-select v-model:value="model.historyRank" :disabled="waitAuth" :options="options"
                                placeholder="请选择历史段位" clearable />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="自我介绍" path="introduction">
                            <n-input v-model:value="model.introduction" :readonly="waitAuth" placeholder="请输入自我介绍"
                                type="textarea" :autosize="{
                                    minRows: 3,
                                    maxRows: 5,
                                }" maxlength="100" show-count />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="请输入联系方式" path="contactNumber">
                            <n-input v-model:value="model.contactNumber" :readonly="waitAuth" placeholder="请输入联系方式" />
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24">
                        <n-form-item-gi :span="24" label="性别" path="sex">
                            <n-radio-group v-model:value="model.sex" :disabled="waitAuth">
                                <n-radio-button value="1">
                                    男
                                </n-radio-button>
                                <n-radio-button value="2">
                                    女
                                </n-radio-button>
                            </n-radio-group>
                        </n-form-item-gi>
                    </n-grid>
                    <n-grid :cols="24" v-if="!waitAuth">
                        <n-form-item-gi :span="24">
                            <n-spin :show="diabledShow">
                                <n-button block type="info" @click="handleSubmit">{{ ['3','4'].includes(comStatus) ? '再次申请' : '提 交'  }}</n-button>
                            </n-spin>
                        </n-form-item-gi>
                    </n-grid>
                </n-form>
            </n-card>
        </div>
        <div v-if="pageType === 'success'" class="result__box">
            <n-result status="success" title="报名成功" description="请等待管理者审核">
            </n-result>
        </div>
        <div v-if="pageType === 'roles'" class="result__box">
            <n-result status="404" title="你在干什么？" description="您已经是解说了呀？笨蛋">
            </n-result>
        </div>
    </nor-header>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { FormInst, useMessage } from 'naive-ui';
import { getByCode } from '@/api/common'
const message = useMessage();
const userStore = useUserStore();
const formRef = ref<FormInst | null>(null)
const model = ref({
    id: null,
    sex: '1',
    gameId: '',
    introduction: '',
    contactNumber: '',
    bizType:'comAuth',
    historyRank: '0',
});
type ComStatus = '0' | '1' | '2' | '3';
const comStatus = ref<ComStatus>('0');
const computedStatus = (comStatus: ComStatus) => {
    const mapList = {
        '0': '待提交',
        '1': '解说招募人审批中，请稍等结果公示',
        '2': '申请成功，恭喜您成为ASG赛事解说',
        '3': '很遗憾，您没有达到ASG的解说申请要求。若有疑问请联系ASG解说管理员：235593230（qq）',
        '4': '管理员已辞退了您的解说工作，请重新申请或者联系ASG赛事组管理员'
    };
    return mapList[comStatus];
}
const computedComType = (comStatus: ComStatus) => {
    const mapList = {
        '0': 'info',
        '1': 'warning',
        '2': 'success',
        '3': 'error',
        '4': 'error'
    };
    return mapList[comStatus];
}

const waitAuth = computed(() => {
    return ['1', '2'].includes(comStatus.value);
})
const { officium, chinaname, id: userId } = userStore.userInfo;
const bizTypeOptions = ref([]);
const getInfo = () => {
    getByCode('ruleConfig').then(res => {
        bizTypeOptions.value = (res?.data ?? []).map(item => {
            return {
                label:item.label,
                value:item.bizType
            }
        });
    });
    getMyEnrollHis(userId).then(({ data }) => {
        if (data.code !== 200) throw new Error('服务端异常，请联系网站管理员');
        if (Array.isArray(data.data) && data.data.length > 0) {
            const row = data.data[0];
            Object.assign(model.value, {
                id: row.id,
                chinaname: row.chinaname,
                contactNumber: row.contact_number,
                gameId: row.game_id,
                historyRank: row.history_rank,
                introduction: row.introduction,
                sex: row.sex.toString(),
                status: row.status,
                bizType:'comAuth'
            });
            comStatus.value = row.status;
        }
    })
}
getInfo();
type PageType = 'enroll' | 'success' | 'roles';
const pageType = ref<PageType>('enroll');
const initPage = () => {
    pageType.value = officium === 'Commentator' ? 'roles' : 'enroll';
}
initPage();
const options = ref([]);
const getOptions = () => {
    getByCode('historyRank').then(res => {
        options.value = res.data;
    })
}
getOptions();
const rules = {
    sex: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请选择性别'
    },
    gameId: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入游戏账号ID'
    },
    introduction: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入自我介绍'
    },
    historyRank: {
        required: true,
        trigger: ['change'],
        message: '请选择历史段位'
    },
    contactNumber: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入联系方式'
    }
}
const diabledShow = ref(false);
const handleSubmit = () => {
    formRef.value?.validate(async (errors) => {
        if (errors) {
            message.error(errors[0][0].message);
            return;
        }
        try {
            diabledShow.value = true;
            const requestBody = {
                ...model.value,
                chinaname,
                userId,
                sex: Number(model.value.sex),
                status: '1'
            }
            const { data } = await beComingCommentary(requestBody);
            if (data.code !== 200) return message.error(data.message || '服务端异常，请联系网站管理员');
            message.success('报名成功，请等待管理员审核。');
            pageType.value = 'success';
        } catch (error) {
            message.error(error.response?.data?.message ?? '未知错误，联系网站管理员');
        } finally {
            diabledShow.value = false;
        }

    })
}
</script>
<style scoped lang='scss'>
$lightenColor: #d2e0f1;
$lightenPrimaryColor: #83aee2;
$primaryColor: #4090EF;

.card__box {
    margin: 16px auto;
    width: 95%;

    .header__text {
        display: flex;
        align-items: center;

        &::before {
            content: '';
            width: 8px;
            height: 1.1rem;
            background-image: linear-gradient(to bottom, $lightenColor, $lightenPrimaryColor, $primaryColor);
            margin-right: 0.5rem;
            border-radius: 6px;
        }

        &::after {
            content: var(--text);
            font-size: 1.1rem;

        }
    }
}

.result__box {
    height: calc(80dvh - 50px);
    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep.n-spin-container {
    width: 100%;
}
</style>