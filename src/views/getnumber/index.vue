<template>
  <nav-back title="注册账号" />
  <main>
    <div class="form-item">
      <p>用户名</p>
      <n-input v-model:value="form.userName" type="text" placeholder="请输入用户名" />
    </div>
    <div class="form-item">
      <p>密码</p>
      <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="密码"  />
    </div>
    <div class="form-item">
      <p>再次输入密码</p>
      <n-input v-model:value="form.rePassword" type="password" show-password-on="click" placeholder="密码"  />
    </div>
    <div class="form-item">
      <p>中文名</p>
      <n-input v-model:value="form.chinaname" type="text" placeholder="请输入中文名" />
    </div>
    <div class="form-item flex">
      <n-input v-model:value="form.captcha" type="text" placeholder="请输入验证码" :maxlength="4" />
      <n-button v-if="capStatus === 'new'" @click="getCode" strong secondary type="info">获取验证码</n-button>
      <img v-else="capStatus === 'code'" class="img__block" :src="canvas">
    </div>
    <p style="color:#f40;" v-if="capStatus === 'code'">{{ codeTime }}秒后重新获取验证码</p>
    <n-button :disabled="loading" style="width:100%;margin:24px 0;" @click="handleEnroll" strong secondary type="primary">注册</n-button>
  </main>

</template>

<script setup lang='ts'>
import { useMessage } from 'naive-ui';

const canvas = ref('');
const message = useMessage();
const router = useRouter();
const form = ref({
  userName: '',
  password: '',
  rePassword: '',
  chinaname: '',
  captcha: ''
});
const loading = ref(false);
const codeTime = ref(60);
const capStatus = ref('new');
const timer = ref(null);
const setRollDonw = () => {
  timer.value = setInterval(() => {
    codeTime.value -= 1;
    if(codeTime.value === 0){
      capStatus.value = 'new';
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
}
const getCode = async () => {
  try {
    const { data, status } = await makeCaptcha();
    if (status !== 200) throw new Error('服务单异常！');
    canvas.value = 'data:image/png;base64,' + data.captchaImage;
    capStatus.value = 'code';
    codeTime.value = 60;
    setRollDonw();
  } catch (error) {
    message.error(error.message);
    capStatus.value = 'new';
  }

}
const handleEnroll = async ()=> {
  try {
    console.log(form.value,'form.value');
    if(!form.value.userName) return message.warning('请填写用户名！');
    if(!form.value.password) return message.warning('请输入密码！');
    if(!form.value.rePassword) return message.warning('请再次输入密码！');
    if(!form.value.chinaname) return message.warning('请填写中文名！');
    if(!form.value.captcha) return message.warning('请填写验证码！');
    loading.value = true;
    const { rePassword,...remain } = form.value;
    const { status } = await enrollV2(remain);
    if(status !== 200) throw new Error('服务端异常，注册失败！');
    message.success('注册成功！');
    router.push({path:'/login'})
  } catch (error) {
    message.error(error.message);
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped lang='scss'>
.img__block {
  width: 100px;
  height: fit-content;
}

main {
  padding: 12px;
  border: 1px solid #e7e7e7;

  .form-item {
    margin-bottom: 24px;

    input {
      width: 100%;
      border-radius: 6px;
      padding: 6px 0;
      outline: none;
      border: 1px solid #e3e3e3;
    }

    &.flex {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
  }
}
</style>