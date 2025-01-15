<template>
    <n-modal v-model:show="modelShow" :mask-closable="false" preset="dialog" title="选择人员" positive-text="确认"
        @positive-click="onPositiveClick">
        <n-scrollbar style="max-height: 60vh">
            <n-tree :multiple="false" accordion block-line cascade checkable :data="roleList" expand-on-click show-line
                @update:checked-keys="handleCheckedKeysChange" />
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang='ts'>
import { getUsersWithRole } from '@/api/common';
import { getByCode } from "@/api/common";
import { useMessage } from 'naive-ui';
interface Role {
    chinaname: string
    email?: string
    id: number
    officium: string
    userName: string
}
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

const roleList = ref([]);
const roleMap = ref([]);
const initRoleMap = async () => {
    const { data } = await getByCode('roleList');
    roleMap.value = data;
}
const emits = defineEmits(['update:visible', 'finishChoose']);
const nMessage = useMessage();
const modelShow = computed({
    get() {
        return props.visible;
    },
    set(value) {
        emits('update:visible', value)
    }
});

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
const checkedKeysArr = ref([]);
const handleCheckedKeysChange = (checkedKeys:number[]) => {
    checkedKeysArr.value = checkedKeys;
}
const init = async ()=> {
    const result = await getUsersWithRole();
    await initRoleMap();
    createTreeData(result.data);
}
init();
const onPositiveClick = () => {
    if (checkedKeysArr.value.length !== 1) {
        return nMessage.warning('有且只能选择一个用户进行邀请');
    }
    emits('finishChoose', checkedKeysArr.value);
}
</script>