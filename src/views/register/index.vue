<template>
       <nav-back title="用户注册" />
       <div class="header-container">
              <img src="/logo/asg.png">
       </div>
       <n-form class="form__container" ref="formRef" :model="registerForm" :rules="rules" label-placement="top">
              <n-form-item label="用户名" path="userName">
                     <n-input type="primary" v-model:value="registerForm.userName" placeholder="请输入用户名"
                            clearable></n-input>
              </n-form-item>
              <n-form-item label="密码" path="password">
                     <n-input v-model:value="registerForm.password" type="password" show-password-on="click"
                            placeholder="请输入密码" clearable>
                     </n-input>
              </n-form-item>
              <n-form-item label="再次输入密码" path="rePassword">
                     <n-input v-model:value="registerForm.rePassword" type="password" show-password-on="click"
                            placeholder="请输入密码" clearable>
                     </n-input>
              </n-form-item>
              <n-form-item label="中文名" path="chinaname">
                     <n-input v-model:value="registerForm.chinaname"  maxlength="8" show-count placeholder="请输入中文名"
                            clearable>
                     </n-input>
              </n-form-item>
                     <n-alert v-if="!registerForm.token" title="人机生成中..." type="warning">
                            等待人机校验中，请不要退出
                     </n-alert>
              <n-form-item>
                     <vue-turnstile v-model="registerForm.token" site-key="0x4AAAAAAAfglgZKAlbqw_YO" language="zh-cn"
                     @error="handleError" />
              </n-form-item>
              <n-button v-show="!!registerForm.token" type="primary" block @click="handleRegister">
                     <span style="margin-right:12px;color:#fff;font-weight: bold">注册</span><n-spin v-show="loading"
                            stroke="#fff" :size="14" />
              </n-button>
       </n-form>
</template>

<script setup lang='ts'>
import { useMessage, FormItemRule, FormRules } from 'naive-ui';
import VueTurnstile from 'vue-turnstile';
const router = useRouter();
const nMessage = useMessage();
const registerForm = ref({
       userName: "",
       password: "",
       rePassword: "",
       chinaname: "",
       token: ""
})
const rules: FormRules = {
       userName: [
              {
                     required: true,
                     validator(rule: FormItemRule, value: string) {
                            if (!value) {
                                   return new Error('请输入用户名')
                            }
                     },
                     trigger: ['input', 'blur']
              }
       ],
       password: [
              {
                     required: true,
                     validator(rule: FormItemRule, value: string) {
                            if (!value) {
                                   return new Error('请输入密码')
                            }
                     },
                     trigger: ['input', 'blur']
              }
       ],
       rePassword: [
              {
                     required: true,
                     validator(rule: FormItemRule, value: string) {
                            if (!value) {
                                   return new Error('请再次输入密码')
                            }
                            if (value !== registerForm.value.password) {
                                   return new Error('两次密码不一致');
                            }
                     },
                     trigger: ['blur']
              }
       ],
       chinaname: [
              {
                     required: true,
                     validator(rule: FormItemRule, value: string) {
                            if (!value) {
                                   return new Error('请输入中文名')
                            }
                     },
                     trigger: ['input', 'blur']
              }
       ]
}
const formRef = ref(null);
const loading = ref(false);
const handleRegister = () => {
       formRef.value?.validate((errors: any) => {
              if (!errors) {
                     register();
              } else {
                     nMessage.error('请输入用户名和密码')
              }
       })
}
const register = async () => {
       loading.value = true;
       try {
              const { status, message } = await registerApi(registerForm.value);
              if (status !== 200) {
                     return nMessage.error(message);
              }
              nMessage.success("注册成功");
              router.push({path:'/login'})
       } catch (error) {
              if(error.response.data.code === 400){
                    return nMessage.error(error.response.data.message);
              }
              nMessage.error(error.message);
       } finally {
              loading.value = false;
       }

}
const handleError = () => {
       nMessage.error("人机验证异常，请重试！");
}
</script>
<style lang="scss" scoped>
.header-container {
       height: 20vh;
       width: 100vw;
       display: flex;
       justify-content: center;
       align-items: center;
       margin-bottom: 12px;
       border-bottom: 2px solid #e7e7e7;

       img {
              width: 10vh;
              height: 10vh;
              border-radius: 10px;
       }
}

.form__container {
       padding: 12px;
}

.loading__container {
       margin: 12px auto;
       width: 90%;
}
</style>
