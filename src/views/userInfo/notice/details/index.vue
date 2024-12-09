<template>
  <nav-back title="公告详情" />
  <div class="news-content">
    <h4>{{ newsConfig.title }}</h4>
    <div class="line"></div>
    <div class="publisher-line">
      <n-tag type="success" size="small">
        发布人：{{ newsConfig.formName }}
      </n-tag>
      <div class="timer">{{ newsConfig.time.slice(0, 10) }}</div>
    </div>
    <div class="main-content">{{ newsConfig.msg }}</div>
  </div>

</template>

<script setup lang='ts'>
const route = useRoute();
interface News {
  formName: string
  id: string
  msg: string
  time: string
  title: string
  type: '1' | '2'
}
const newsConfig = computed<News>(() => {
  return route.query;
})
</script>
<style scoped lang='scss'>
.news-content {
  width: 90%;
  margin: 0 auto;

  h4 {
    margin: 18px 0;
    text-align: center;
    font-size: 1.2em;
  }

  .line {
    height: 5px;
    width: 100%;
    background: #dedede;
    border-radius: 5px 5px 0 0;
  }

  .publisher-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 0;
    width: 100%;

    .timer {
      font-size: 0.8em;
      color: #979797;
      font-weight: 400;
      width: 7em;
    }
  }

  .main-content {
    color: #979797;
    font-size: 0.95em;
    text-indent:2em;
    line-height: 2.5em;
    font-family: 'HarmonyOS_Regular';
  }
}
</style>