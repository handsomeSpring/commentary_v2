<template>
  <div id="vaptcha-container"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const token = ref('');

const loadV3Script = () => {
  return new Promise<void>((resolve) => {
    if (typeof window.vaptcha === 'function') {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = 'https://v.vaptcha.com/v3.js';
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
          resolve();
          script.onload = script.onreadystatechange = null;
        }
      };
      document.head.appendChild(script);
    }
  });
};

onMounted(() => {
  const config = {
    vid: '67134feddc0ff12924d9aaf4',
    mode: 'click',
    scene: 0,
    container: document.getElementById('vaptcha-container') as HTMLElement,
    style: 'light',
    color: '#00BFFF',
    lang: 'auto',
    area: 'auto',
  };
  console.log(config);
  loadV3Script().then(() => {
    window.vaptcha(config).then((obj) => {
      window.vaptchaObj = obj;
      obj.listen('pass', () => {
        token.value = obj.getToken();
      });
      obj.listen('close', () => {
        obj.reset();
      });
      obj.render();
    });
  });
});

const getToken = () => {
  const serverToken = window.vaptchaObj.getServerToken();
  token.value = serverToken;
};

const reset = () => {
  window.vaptchaObj.reset();
};

watch(token, (serverToken) => {
  console.log('server :', serverToken);
});
</script>

<style scoped>

</style>


