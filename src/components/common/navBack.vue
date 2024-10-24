<template>
  <div class="grid-header">
    <svg @click="routerBack" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208s208-93.13 208-208S370.87 48 256 48m62.63 304L296 374.63L177.37 256L296 137.37L318.63 160l-96 96Z"/></svg>
    <p>{{ props.title }}</p>
    <div></div>
  </div>
</template>

<script setup lang='ts'>
const props = defineProps({
    title:{
        type:String,
        default:""
    }
})
const router = useRouter();
const routerBack = ()=>{
    router.back();
}
</script>
<style scoped lang='scss'>
.grid-header{
    position: sticky;
    z-index:999;
    top:0;
    display: grid;
    grid-template-columns: 10vw auto 10vw;
    align-items: center;
    height:45px;
    background-color: #9cc9e5;
    svg{
        margin-left:12px;
        color:#ebedf3;
    }
    p{
        text-align: center;
        color:#ebedf3;
        font-size: 1rem;
        font-weight: bold;
    }
}
</style>