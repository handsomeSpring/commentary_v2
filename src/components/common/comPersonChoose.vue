<template>
    <n-modal v-model:show="modelShow" :mask-closable="false" preset="dialog" title="选择人员" positive-text="确认" @positive-click="onPositiveClick" @after-leave="closeDialog">
        <n-scrollbar style="max-height: 60vh">
            <n-table :bordered="false" :single-line="false">
                <thead>
                    <tr>
                        <th></th>
                        <th style="text-align: center;">姓名</th>
                        <th style="text-align: center;">qq号</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in comList" :key="item.id">
                        <td width="10%">
                            <n-checkbox v-model:checked="item.isCheck" @update:checked="handleCheck(index,$event)"></n-checkbox>
                        </td>
                        <td width="40%" align="center">{{ item.name }}</td>
                        <td width="50%" align="center">{{ item.qq || '未绑定qq号'}}</td>
                    </tr>
                </tbody>
            </n-table>
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang='ts'>
import { useMessage } from 'naive-ui';
interface FilterCom {
    name:string
    qq?:string
    id:number
    isCheck:boolean
}
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
const emits = defineEmits(['update:visible', 'finishChoose']);
const modelShow = computed({
    get() {
        return props.visible;
    },
    set(value) {
        emits('update:visible', value)
    }
});

const choosePerson = computed(()=>{
    return comList.filter(item => item.isCheck);
})

const message = useMessage();
const comList = reactive<FilterCom[]>([]);
const init = async () => {
    try {
        const { data } = await getByOpName('Commentator');
        (data ?? []).forEach((item: ComRole) => {
            comList.push({
                name: item.chinaname,
                id: item.id,
                qq: item.qqnumber,
                isCheck: false
            })
        })
    } catch (error) {
        message.error(error.message);
    }
}
init();

// 选择
const handleCheck = (index:number,event:Event) => {
    comList.forEach((item:FilterCom, i:number) => {
        item.isCheck = event && index === i
    })
}
const onPositiveClick = () => {
    if(choosePerson.value.length === 0){
        return message.warning('请选择一个用户进行邀请');
    }
    const inviteId = choosePerson.value[0]?.id ?? null;
    if(!inviteId) {
        return message.error('获取邀请id失败，邀请错误！');
    }
    emits('finishChoose', inviteId);
}
const closeDialog = () =>{
    comList.forEach((item:FilterCom) => {
        item.isCheck = false;
    })
}
</script>
<style scoped lang='scss'></style>