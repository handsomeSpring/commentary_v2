<template>
    <nav-back title="ASG办赛流程一览" />
    <div class="flow-content">
        <li class="parent_li" v-for="(item, index) in allFlowInfo" :key="index">
            <div class="title_header">
                <div class="tag_header">{{ item.parentTitle }}</div>
                <div class="text_header">
                    <p class="title">{{ item.parentInfo }}</p>
                    <p class="time_tag">{{ item.tag }}</p>
                </div>
            </div>
            <div class="child_li" v-for="(child, childI) in item.children" :key="`${childI}-child`">
                <div class="line">
                    <div class="circle"></div>
                </div>
                <div class="content">
                    <div class="title">{{ child.tag }}</div>
                    <div class="main_content">
                        <p>{{ child.childInfo }}</p>
                    </div>
                </div>
            </div>
        </li>
        <li class="parent_li">
            <div class="title_header">
                <div class="tag_header">结束</div>
                <div class="text_header"></div>
            </div>
        </li>
    </div>
</template>

<script setup lang='ts'>
import { allFlowInfo } from "./const";
</script>
<style scoped lang='scss'>
.flow-content {
    width: 95%;
    margin:1em auto;
    .parent_li {
        .title_header {
            display: flex;
            justify-content: flex-start;
            gap: 12px;
            margin: 12px 0;

            .tag_header {
                width: 38px;
                height: 38px;
                background: #AED2E8;
                border-radius: 8px;
                border: 1px solid #AED2E8;
                font-weight: 500;
                font-size: 14px;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .text_header {
                display: flex;
                justify-content: center;
                flex-direction: column;

                .title {
                    font-weight: 400;
                    font-size: 16px;
                    color: #1f2123;
                    line-height: 19px;
                }

                .time_tag {
                    font-weight: 400;
                    font-size: 13px;
                    color: #959595;
                    line-height: 15px;
                }
            }
        }
    }

    .child_li {
        display: flex;
        justify-content: flex-start;
        gap: 12px;
        position: relative;

        .line {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 100%;

            &::after {
                position: absolute;
                content: "";
                width: 2px;
                height: 90%;
                background: #e7e7e7;
                left: 18px;
                top: 14px;
            }

            .circle {
                width: 9px;
                height: 9px;
                background: #CAE5D3;
                border-radius: 100px;
                border: 1px solid #CAE5D3;
            }
        }

        .content {
            width: 80%;
            .title {
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 13px;
                color: #5b5d5f;
                line-height: 15px;
            }

            .main_content {
                width: 100%;
                background: #f6f6f6;
                border-radius: 8px;
                margin: 6px 0;
                padding: 8px;

                p {
                    font-weight: 500;
                    font-size: 12px;
                    color: #AED2E8;
                    line-height: 18px;
                }
            }
        }
    }
}
</style>