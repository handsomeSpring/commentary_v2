<template>
    <div class="header-content">
        <div>参数</div>
        <div>类型</div>
        <div>说明</div>
    </div>
    <div class="body-content" v-for="(item, index) in props.tableData" :key="index">
        <div>
             {{ item.name }}
        </div>
        <div>{{ item.type }}</div>
        <div>{{ item.doc }}</div>
    </div>
</template>

<script setup lang="ts">
interface TableData {
    type: string;
    name: string;
    doc: string;
}

const props = defineProps<{
    tableData: TableData[];
}>()
</script>
<style lang='scss' scoped>
.body-content,
.header-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
    border-bottom: 1px solid #dcdfe6;
    padding: 1em;
    color: #909399;
    text-align: left;

    div {
        width: 100%;
        overflow-wrap: break-word;
    }
}

.body-content {
    color: #606266 !important;
}
</style>