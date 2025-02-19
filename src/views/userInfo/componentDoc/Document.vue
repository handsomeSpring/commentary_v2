<template>
    <div class="main-container">
        <li class="card-container">
            <div class="card-header">
                <n-gradient-text type="info" size="16">
                    AsgEmpty-空显示
                </n-gradient-text>
            </div>
            <div class="card-main">
                <asg-empty description="暂无内容" :showMinHeight="false"></asg-empty>
            </div>
            <n-divider title-placement="center">
                代码展示
            </n-divider>
            <div class="code-show">
                <pre>
                    <code>
&lt;template>
    &lt;asg-empty 
      description="暂无内容"
      :showMinHeight="false"
    >&lt;/asg-empty>
&lt;/template>
                    </code>
                </pre>
            </div>
            <n-divider title-placement="center">
                参数
            </n-divider>
            <propTable :tableData="emptyTableData"></propTable>
        </li>
    </div>
</template>

<script setup lang='ts'>
import propTable from './PropTable.vue';
const emptyTableData = [{
    name: 'description',
    doc: '空字符描述',
    type: 'string'
},
{
    name: 'showMinHeight',
    doc: '是否需要最小高度，最小高度为减去顶部和底部导航的中间部分。',
    type: 'boolean:默认true'
}]
</script>
<style scoped lang='scss'>
.main-container {
    width: 90%;
    margin: 1em auto;

    .card-container {
        border-radius: 6pt;
        padding: 12px;
        margin: 12px auto;
        background: #fff;

        .card-header {
            padding: 0.5em 0;
            border-bottom: 1px solid var(--main-theme-text);
        }

        .card-main {
            padding: 2em;
        }

        // 代码展示区域
        .code-show {
            width: 100%;
            overflow: auto;
        }
    }
}
</style>