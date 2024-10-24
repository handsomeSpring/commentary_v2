<template>
    <nav-back title="帮助中心" />
    <div class="header__container">
        <img src="@/assets/images/zq.png">
        <div class="radius__white">
            开发人员：浊泉
        </div>
    </div>
    <div class="asg__title">联系方式</div>
    <div class="br__content"></div>
    <div class="main__content">
      <p>前端开发工程师浊泉QQ:793651012</p>
      <p>后端开发工程师罗澜QQ:2667210109</p>
      <p>后端开发工程师七千QQ:2307953404</p>
    </div>
    <img class="fixed__image" src="@/assets/images/cartoon.png">
</template>

<script setup lang='ts'>
</script>
<style scoped lang='scss'>
.header__container {
    width: 100%;
    height: 20vh;
    background: url('../../../assets/images/helper_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-bottom: 1px solid orange;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        margin-bottom: 12px;
    }

    .radius__white {
        padding: 6px 12px;
        width: fit-content;
        border-radius: 15px;
        background: #fff;
        color: orange;
        font-size: 0.8rem;
    }
}

.asg__title {
    padding:12px;
    border-bottom: 1px solid #e7e7e7;
}
.br__content{
    height:5px;
    background: #e7e7e7;
}
.main__content{
    padding:12px;
}
.fixed__image{
    position: fixed;
    bottom:0;
    right:0;
    width:120px;
    height:120px;
}
</style>