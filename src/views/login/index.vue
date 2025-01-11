<template>
    <div class="login-container">
        <div class="login-header">
            <img src="/logo/asg.png">
            <Bubble />
        </div>
        <div class="login-form">
            <div class="form-body">
                <p class="title-text">
                    <n-gradient-text type="info" size="28" :gradient="{
                        from: '#CAE5D3',
                        to: '#9CC9E5',
                    }">
                        ASG解说选班系统
                    </n-gradient-text>
                </p>
                <n-form ref="formRef" :model="loginForm" :rules="rules" label-placement="top">
                    <n-form-item label="用户名" path="userName">
                        <n-input size="large"  type="primary" v-model:value="loginForm.userName" placeholder="请输入用户名"
                            clearable></n-input>
                    </n-form-item>
                    <n-form-item label="密码" path="password">
                        <n-input size="large" v-model:value="loginForm.password" type="password" show-password-on="click"
                            placeholder="请输入密码" clearable>
                            <template #password-visible-icon>
                                <n-icon :size="16" :component="GlassesOutline" />
                            </template>
                            <template #password-invisible-icon>
                                <n-icon :size="16" :component="Glasses" />
                            </template>
                        </n-input>
                    </n-form-item>
                    <p class="mark-tip">
                        <a @click="routerToEnroll">成为解说</a>
                        <a @click="routerToRegister('/register')">没有账号？立即注册</a>
                    </p>
                    <n-button size="large"  type="primary" block @click="handleLogin">
                        <span style="margin-right:12px;color:#fff;font-weight: bold">登录</span><n-spin v-show="loading"
                            stroke="#fff" :size="14" />
                    </n-button>
                </n-form>
            </div>
            <div class="tag-body">
                ASG赛事<n-divider vertical />bilibili<n-divider vertical />网易<n-divider vertical />第五人格
            </div>
            <nor-footer></nor-footer>
        </div>
    </div>
</template>
<script setup lang="ts">
import { setToken, getToken } from '@/utils/auth';
import { Glasses, GlassesOutline } from '@vicons/ionicons5'
import Bubble from "@/components/common/Bubble.vue"
import { useUserStore } from "@/store/user"
import { useMessage, FormItemRule, FormRules } from 'naive-ui';
import eventEmitter from "@/utils/eventEmitter";
const nMessage = useMessage();
const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
    userName: "",
    password: ""
})

const loading = ref<boolean>(false);
const formRef = ref(null);
const handleLogin = () => {
    formRef.value?.validate((errors: any) => {
        if (!errors) {
            login();
        } else {
            nMessage.error('请输入用户名和密码')
        }
    })
}
const login = async () => {
    loading.value = true;
    try {
        const { data, status } = await loginByName(loginForm.value);
        if (status !== 200) nMessage.error('服务端异常！');
        setToken(data);
        const { data: info } = await getUserInfo();
        userStore.setAllUserInfos(info)
        nMessage.success("登录成功！");
        router.push({ path: '/home' })
    } catch (error) {
        if (error instanceof Object
            && 'response' in error
            && error.response instanceof Object
            && 'data' in error.response
            && 'message' in error.response.data
        ) {
            nMessage.error(error.response.data.message);
        }
    } finally {
        loading.value = false;
    }


}
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
    ]
}
const routerToEnroll = () => {
    if (getToken()) {
        router.push({ path: '/enroll' });
    } else {
        nMessage.warning("请先登录后再报名解说。");
    }
}
const routerToRegister = (path:string) => {
    // window.open("https://idvasg.cn/", "_blank");
    router.push({
        path,
    })
}
eventEmitter.on('API:UN_AUTH',()=>{
    nMessage.error('鉴权过期，请重新登录',{ duration: 5000 });
})
</script>
<style lang="scss" scoped>
.login-container {
    background: radial-gradient(#cae5d3, #9cc9e5, #ebedf3);
    height: 100dvh;
    width: 100%;
    overflow-x:hidden;
    display: flex;
    flex-direction: column;

    .login-header {
        position: relative;
        // height: 30%;
        margin: auto 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            display: block;
            width: 25%;
            height: auto;
        }

        #tsparticles {
            height: 100%;
            width: 100%;
        }
    }

    .login-form {
        z-index: 9999;
        position: relative;
        border-radius: 30px 30px 0 0;
        width: 100%;
        flex-shrink: 0;
        // min-height:70%;
        background: #fff;
        box-shadow: 1px 1px 10px rgba(255, 255, 255, .3);
        display: flex;
        align-items: flex-start;
        flex-direction: column;

        .form-body {
            margin: 1em auto;
            width: 80%;
            .mark-tip {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-bottom:1em;

                a {
                    color: #9CC9E5;
                    text-decoration: underline;
                }
            }

            .title-text {
                text-align: center;
                margin: 1em 0;
            }
        }

        .tag-body {
            width: 80%;
            margin: 1em auto;
            color: #9CC9E5;
            display: flex;
            justify-content: center;
        }

        .footer {
            width: 100%;
            margin: 1em 0;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    }
}

.n-form-item .n-form-item-label {
    color: red;
}
</style>