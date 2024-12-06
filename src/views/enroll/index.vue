<template>
    <nor-header title="职位申请记录" activeMenu="3">
        <full-screen-loading v-if="loading"></full-screen-loading>
        <template v-else>
            <div class="full-screen" v-if="list.length === 0">
                <n-result status="404" title="暂无申请记录" description="竟然还没有申请我们ASG赛事？快点申请吧！">
                    <template #footer>
                        <n-button @click="toDetails('add', {})">前往申请</n-button>
                    </template>
                </n-result>
            </div>
            <div v-else class="asg-content">
                <div class="item-row" v-for="item in list" :key="item.id">
                    <header>
                        <p>{{ item.bizTypeName }}</p>
                        <p v-if="['2', '1', '5'].includes(item.status)" class="btn_text"
                            @click="toDetails('view', item)">查询
                        </p>
                        <p v-else-if="['3', '4'].includes(item.status)" class="btn_text"
                            @click="toDetails('edit', item)">
                            再次申请
                        </p>
                    </header>
                    <main>
                        <p>申请时间：{{ item.createTime }}</p>
                        <p>
                            <n-gradient-text :type="computedType(item.status)">
                                {{ computedStatus(item.status) }}
                            </n-gradient-text>
                        </p>
                    </main>
                </div>
            </div>
        </template>
    </nor-header>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { useMessage } from 'naive-ui';
import { getByCode } from '@/api/common'
const message = useMessage();
const userStore = useUserStore();
const router = useRouter();
interface Info {
    id?: number,
    sex?: '1' | '2',
    gameId?: string,
    introduction?: string,
    contactNumber?: string,
    bizType?: string,
    historyRank?: string,
    bizTypeName?: string,
    createTime?: string
    status?: ComStatus
};
type ComStatus = '0' | '1' | '2' | '3' | '4' | '5';
const loading = ref(false);
const computedStatus = (comStatus: ComStatus) => {
    const mapList = {
        '0': '待提交',
        '1': '待审核',
        '2': '审核通过',
        '3': '申请驳回',
        '4': '已辞退',
        '5': '流程审批中'
    };
    return mapList[comStatus];
}
const computedType = (comStatus: ComStatus) => {
    const mapList = {
        '0': 'info',
        '1': 'warning',
        '2': 'success',
        '3': 'error',
        '4': 'error',
        '5': 'warning'
    };
    return mapList[comStatus];
}
const bizTypeOptions = ref([]);
const list = ref<Info[]>([]);
const getInfo = () => {
    loading.value = true;
    getByCode('ruleConfig').then(res => {
        bizTypeOptions.value = (res?.data ?? []).map(item => {
            return {
                label: item.label,
                value: item.bizType
            }
        });
        getMyEnrollHis(userStore.userInfo.id).then(({ data }) => {
            if (data.code !== 200) message.error('服务端异常，请联系网站管理员');
            if (Array.isArray(data.data) && data.data.length > 0) {
                list.value = data.data.map(row => {
                    return {
                        id: row.id,
                        chinaname: row.chinaname,
                        contactNumber: row.contact_number,
                        gameId: row.game_id,
                        historyRank: row.history_rank,
                        introduction: row.introduction,
                        sex: row.sex ? row.sex.toString() : null,
                        status: row.status,
                        bizType: row.biz_type,
                        createTime: row.create_time ? row.create_time.slice(0, 10) : '',
                        bizTypeName: bizTypeOptions.value.find(item => item.value === row.biz_type)?.label ?? '未知业务',
                        reqRole: row.req_role ?? '',
                    }
                });
            }
        })
    }).finally(() => {
        setTimeout(() => {
            loading.value = false; 
        }, 800);
    })
}
getInfo();
const toDetails = (type: string, info: Info) => {
    router.push({
        path: '/enroll/details', query: {
            ...info,
            type,
        }
    })
}
</script>
<style scoped lang='scss'>
.full-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.asg-content {
    width: 95%;
    margin: 12px auto;

    .item-row {
        margin: 24px 0;

        header {
            background: linear-gradient(172deg, #B3D4FF 0%, rgba(255, 255, 255, 0) 93%);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px;
            border-radius: 10px 0 0 0;

            .btn_text {
                font-size: 1em;
                font-weight: 500;
                color: #4090EF;
            }
        }

        main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 6px;
            color: #696969;
            font-size: 14px;
            font-weight: 500;
        }
    }
}
</style>