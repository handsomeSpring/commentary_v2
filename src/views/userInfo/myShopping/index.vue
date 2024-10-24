<template>
  <nav-back title="我的兑换" />
  <template v-if="loading">
    <n-skeleton text :repeat="4" />
    <n-skeleton text style="width: 87%" :repeat="2" />
    <n-skeleton text style="width: 70%" :repeat="2" />
    <n-skeleton text style="width: 50%" />
  </template>
  <template v-else>
    <n-card v-if="myStoreList.length > 0" v-for="item in myStoreList">
      <n-collapse>
        <n-collapse-item :title="item.name" name="1">
          <div>
            <p class="goods__info">商品描述：{{ item.description }}</p>
            <p class="goods__info">商品介绍：{{ item.information }}</p>
            <n-steps size="small" :current="item.isVerification ? 2 : 1"
              :status="item.isVerification ? 'finish' : 'process'">
              <n-step title="待核销" />
              <n-step title="已结单" />
            </n-steps>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
    <div class="no__empty" v-else>
      <n-empty description="无商品"></n-empty>
    </div>
  </template>

</template>

<script setup lang='ts'>
import { getMyShopping } from '@/api/commentary';
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
    nextTick(()=>{
      loading.value = false;
    })
  }
}
getShopping();
</script>
<style scoped lang='scss'>
.n-card {
  width: 98%;
  margin: 12px auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .n-card__content {
    padding: 0.8em !important;
  }

  .goods__info {
    font-size: 0.8rem;
    color: #979797;
    margin: 0.5em 0;
  }
}

.no__empty {
  height: 60vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>