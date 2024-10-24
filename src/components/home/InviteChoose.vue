<template>
    <n-modal v-model:show="modelShow" :mask-closable="false" preset="dialog" title="选择人员" positive-text="确认"
        @positive-click="onPositiveClick">
        <n-scrollbar style="max-height: 60vh">
            <n-tree :multiple="false" accordion block-line cascade checkable :data="treeList" expand-on-click show-line
                @update:checked-keys="handleCheckedKeysChange" />
        </n-scrollbar>
    </n-modal>
</template>

<script setup lang='ts'>
import { useMessage } from 'naive-ui';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    treeList: {
        type: Array,
        default: () => []
    }
})
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
const checkedKeysArr = ref([]);
const handleCheckedKeysChange = (checkedKeys:number[]) => {
    checkedKeysArr.value = checkedKeys;
}
const onPositiveClick = () => {
    if (checkedKeysArr.value.length !== 1) {
        return nMessage.warning('有且只能选择一个用户进行邀请');
    }
    emits('finishChoose', checkedKeysArr.value);
}
</script>