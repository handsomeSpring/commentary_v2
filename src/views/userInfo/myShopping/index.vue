<template>
  <nav-back title="我的兑换" />
  <full-screen-loading v-if="loading">
  </full-screen-loading>
  <template v-else>
    <div class="div-content" v-if="myStoreList.length > 0">
      <li v-for="(item, index) in myStoreList" :key="index" :class="item.isVerification ? 'success' : 'warning'">
        <div class="left-part" :class="item.isVerification ? 'success' : 'warning'">
          <n-icon size="36" v-if="item.isVerification" color="#fff">
            <CheckmarkCircleOutline />
          </n-icon>
          <n-icon size="36" v-else color="#fff">
            <TimeOutline />
          </n-icon>
          <p>{{ item.isVerification ? '已核销' : '待核销' }}</p>
        </div>
        <div class="right-part">
          <h4>{{ item.name }}</h4>
          <p>{{ item.description }}</p>
          <p>{{ item.information }}</p>
        </div>
      </li>
    </div>
    <div class="no__empty" v-else>
      <asg-empty description="暂无购物信息"></asg-empty>
    </div>
  </template>

</template>

<script setup lang='ts'>
import { getMyShopping } from '@/api/commentary';
import { CheckmarkCircleOutline, TimeOutline } from "@vicons/ionicons5";
const myStoreList = ref([]);
const loading = ref(false);
async function getShopping() {
  try {
    loading.value = true;
    const { data } = await getMyShopping();
    myStoreList.value = data ?? [];
  } catch (error) {
    console.log(error.message);
  } finally {
    nextTick(() => {
      loading.value = false;
    })
  }
}
getShopping();
</script>
<style scoped lang='scss'>
.div-content {
  width: 95%;
  margin: 1em auto;

  li {
    width: 100%;
    background: rgba(235, 243, 254, 0.5);
    box-shadow: 0px 4px 10px 0px rgba(147, 147, 147, 0.35);
    border-radius: 6px 6px 6px 6px;
    border: 2px solid #0C80E5;
    display: flex;
    align-items: stretch;
    height: auto;
    box-sizing: border-box;
    margin:1em 0;

    &.success {
      border: 2px solid#0BC473;
    }

    &.warning {
      border: 2px solid #0C80E5;
    }

    .left-part {
      width: 61px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
      flex-shrink: 0;

      &.success {
        background:#0BC473;
      }

      &.warning {
        background:#0C80E5;
      }

      p {
        color: #fff;
      }
    }

    .right-part {
      padding: 17px 10px;

      h4 {
        font-weight: 500;
        font-size: 14px;
        color: #000000;
        line-height: 15px;
        margin-bottom: 0.5em;
      }

      p {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #575757;
        line-height: 13px;
      }
    }
  }
}

.no__empty {
  height: calc(100dvh - 45px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>