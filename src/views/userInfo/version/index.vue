<template>
  <div class="container">
    <nav-back title="版本信息" />
    <div class="logo-wrap">
      <img  src="/logo/asg.png">
    </div>
    <div class="list-wrap">
      <li>版本信息：{{ version }}</li>
      <li>开发人员：浊泉、罗澜、七千、有雨、二十、雪落鸢飞、会莹的、唯因虚梦、星宇</li>
      <li @click="jumpToOutline">非商用字体：HarmonyOS sans</li>
      <li>ICP备案号：<a href="https://beian.miit.gov.cn/" target="_blank">鄂ICP备2024037646号-1</a></li>
    </div>
    <div class="footer-text">
      <p>网易第五人格复仇者电竞</p>
      <p>©2024 AvengerS Gaming CopyRight</p>
    </div>
  </div>
</template>

<script setup lang='ts'>
const version = ref('');
(async function init(){
  if(sessionStorage.getItem('asg-commentary-version')){
    version.value = sessionStorage.getItem('asg-commentary-version');
  }else{
    const { data } = await getByCode('versionConfig');
    const versionValue = data.find(item => item.system === 'commentary')?.version;
    sessionStorage.setItem('asg-commentary-version',versionValue);
  }
})();
const jumpToOutline = ()=> {
  window.open('https://developer.huawei.com/consumer/cn/','_blank');
}
</script>
<style scoped lang='scss'>
.logo-wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height:180px;
  width: 100%;
  border-bottom: 2px solid #e7e7e7;
  background: #fff;
  img{
    height:120px;
    width:120px;
  }
}
.list-wrap{
  width:100%;
  background: #fff;
  li{
    padding:12px;
    border-bottom: 1px solid #e7e7e7;
    a{
      text-decoration: none;
      color:#9CC9E5;
      font-weight: bold;
    }
  }
}
.container{
  height: 100dvh;
  position: relative;
  background-color:#d9d9d9;
  .footer-text{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    bottom:1dvh;
    width: 100vw;
    p{
      font-size: 0.8rem;
      font-weight: 500;
      color:#2c2c2c;
    }
  }
}
</style>