<template>
    <nav-back title="我的任务" />
    <main v-if="tasks.length > 0">
        <n-timeline>
            <n-timeline-item v-for="(task, index) in tasks" :key="index" :title="task.taskName"
                :type="computedType(task.status)">
                <n-card>
                    <p>
                        <n-gradient-text size="16" :type="computedGradientType(task.status)">
                            {{ computedText(task.status) }}
                        </n-gradient-text>
                    </p>
                    <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
                        <p>{{ task.taskDescription }}</p>
                    </n-ellipsis>
                    <footer class="card__footer">
                        <n-button-group size="small">
                            <n-button v-show="['0', '3'].includes(task.status)" type="primary" strong secondary
                                @click="handleTaskDone(task)">
                                完成任务
                            </n-button>
                            <n-button type="default" @click="showAllFlow(task)">
                                查看流程
                            </n-button>
                        </n-button-group>
                    </footer>
                </n-card>
            </n-timeline-item>
        </n-timeline>
    </main>
    <div class="result__main" v-else>
        <asg-empty  description="暂时无任务，请咨询主办方">
        </asg-empty>
    </div>
    <!-- 弹窗组件 -->
    <n-modal v-model:show="showModal" preset="dialog" title="查看任务全流程">
        <n-steps vertical>
            <n-step status="finish" title="创建任务">
                <n-card>
                    <p>{{ taskFlowObject.taskName }}</p>
                    <div class="flow__card--flex">
                        <p>{{ taskFlowObject.createPerson }}</p>
                        <p>
                            <n-icon :size="13" :component="Time" />
                            {{ taskFlowObject.createTime || '-' }}

                        </p>
                    </div>
                </n-card>
            </n-step>
            <n-step :status="computedUserStep(taskFlowObject.status)" title="执行情况">
                <n-card>
                    <div class="flow__card--flex">
                        <p>{{ taskFlowObject.chinaname }}</p>
                        <p>
                            {{ completeText(taskFlowObject.status) }}
                        </p>
                    </div>
                </n-card>
            </n-step>
            <n-step :status="computedStep(taskFlowObject.status)" title="审批结论">
                <n-card>
                    <p>
                        <n-gradient-text size="16" :type="computedGradientType(taskFlowObject.status)">
                            {{ computedText(taskFlowObject.status) }}
                        </n-gradient-text>
                    </p>
                    <template v-if="['2', '3'].includes(taskFlowObject.status)">
                        <div class="flow__card--flex">
                            <p>审批人</p>
                            <p>
                                <n-icon :size="13" :component="Time" />
                                {{ taskFlowObject.approvalPerson }}
                            </p>
                        </div>
                        <div class="flow__card--flex">
                            <p>操作时间</p>
                            <p>
                                <n-icon :size="13" :component="Time" />
                                {{ taskFlowObject.lastOperateTime || '-' }}
                            </p>
                        </div>
                    </template>
                </n-card>
            </n-step>
        </n-steps>
    </n-modal>
</template>

<script setup lang='ts'>
import { useUserStore } from '@/store/user';
import { useDialog, useMessage } from 'naive-ui';
import { Time } from '@vicons/ionicons5'
const userStore = useUserStore();
const nMessage = useMessage();
const dialog = useDialog();
type Status = '0' | '1' | '2' | '3'
interface Task {
    chinaname?: string,
    createTime?: string,
    id?: number,
    lastOperateTime?: string,
    money?: number,
    status?: Status,
    taskDescription?: string,
    taskName?: string,
    userId?: number
    createPerson?: string
    approvalPerson?: string
}
const tasks = ref<Task[]>([]);
const initTask = () => {
    getTask(userStore.userInfo.id)
        .then(({ data }) => {
            tasks.value = data;
        })
        .catch((error: Error) => {
            nMessage.error(error.message);
        })
}
const computedType = (status: Status) => {
    const mapStatus = {
        '0': 'default',
        '1': 'warning',
        '2': 'success',
        '3': 'error'
    }
    return mapStatus[status];
}
const computedGradientType = (status: Status) => {
    const mapStatus = {
        '0': 'info',
        '1': 'warning',
        '2': 'success',
        '3': 'danger'
    }
    return mapStatus[status];
}
const computedStep = (status: Status) => {
    const mapStatus = {
        '0': 'process',
        '1': 'wait',
        '2': 'finish',
        '3': 'error'
    }
    return mapStatus[status];
}
const computedUserStep = (status: Status) => {
    const mapStatus = {
        '0': 'process',
        '1': 'finish',
        '2': 'finish',
        '3': 'process'
    }
    return mapStatus[status];
}
const computedText = (status: Status) => {
    const textMap = {
        '0': '任务进行中',
        '1': '待任务下发人审核',
        '2': '已完成任务',
        '3': '任务不通过-驳回'
    }
    return textMap[status];
}
const completeText = (status: Status) => {
    const textMap = {
        '0': '进行中',
        '1': '已完成',
        '2': '已完成',
        '3': '重新完成中'
    }
    return textMap[status];
}
initTask();

const handleTaskDone = (task: Task) => {
    dialog.info({
        title: '提示',
        content: '您确定完成了下发的任务，送超级管理审核吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            await taskFinish(task.id);
            initTask();
        },
        onNegativeClick: () => {
            return;
        }
    })
}

const showModal = ref(false);
const taskFlowObject = reactive<Task>({});
const showAllFlow = (task: Task) => {
    showModal.value = true;
    Object.assign(taskFlowObject, task);
}
</script>
<style scoped lang='scss'>
main {
    margin: 24px 0;
    padding: 0 12px;
}

.card__footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.flow__card--flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-top: 8px;
    color: #4090EF;
}

.result__main {
    height: calc(80dvh - 60px);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>