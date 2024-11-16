<template>
  <nav-back title="用户注册" />
  <div class="background-content">
    <div class="layer1"></div>
    <div class="layer2"></div>
    <div class="layer3"></div>
    <div class="layer4"></div>
    <div class="layer5"></div>
    <div class="form_warp">
      <n-form
        class="form__container"
        ref="formRef"
        :model="registerForm"
        :rules="rules"
        label-placement="top"
      >
        <n-form-item label="用户名" path="userName">
          <n-input
            type="primary"
            v-model:value="registerForm.userName"
            placeholder="请输入用户名"
            clearable
          ></n-input>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="registerForm.password"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            clearable
          >
          </n-input>
        </n-form-item>
        <n-form-item label="再次输入密码" path="rePassword">
          <n-input
            v-model:value="registerForm.rePassword"
            type="password"
            show-password-on="click"
            placeholder="请输入密码"
            clearable
          >
          </n-input>
        </n-form-item>
        <n-form-item label="中文名" path="chinaname">
          <n-input
            v-model:value="registerForm.chinaname"
            maxlength="8"
            show-count
            placeholder="请输入中文名"
            clearable
          >
          </n-input>
        </n-form-item>
        <n-form-item label="qq号" path="qqNumber">
          <n-input
            v-model:value="registerForm.qqNumber"
            placeholder="请输入qq号"
            clearable
          >
          </n-input>
        </n-form-item>
        <n-form-item>
          <VaptchaComponent @change="handleGetToken" />
        </n-form-item>
        <n-button
          type="primary"
          block
          @click="handleRegister"
          :disabled="!tokenObj.token"
        >
          <span style="margin-right: 12px; color: #fff; font-weight: bold"
            >注册</span
          ><n-spin v-show="loading" stroke="#fff" :size="14" />
        </n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage, FormItemRule, FormRules } from "naive-ui";
import VaptchaComponent from "@/components/VaptchaComponent.vue";
import { getMathIpv } from "@/utils/index";
const router = useRouter();
const nMessage = useMessage();
const registerForm = ref({
  userName: "",
  password: "",
  rePassword: "",
  chinaname: "",
  qqNumber: "",
});
const rules: FormRules = {
  userName: [
    {
      message: "请输入账号",
      required: true,
      trigger: "blur",
    },
    {
      message:
        "账号必须由数字、字母、下划线和 @ 4种字符的其中一种或多种部分组成",
      pattern: /^[\w@]+$/u,
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入密码");
        }
      },
      trigger: ["input", "blur"],
    },
  ],
  rePassword: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请再次输入密码");
        }
        if (value !== registerForm.value.password) {
          return new Error("两次密码不一致");
        }
      },
      trigger: ["blur"],
    },
  ],
  chinaname: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入中文名");
        }
      },
      trigger: ["input", "blur"],
    },
  ],
  qqNumber: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入qq号");
        }
      },
      trigger: ["input", "blur"],
    },
  ],
};
const formRef = ref(null);
const loading = ref(false);
const handleRegister = () => {
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      register();
    } else {
      nMessage.error("请输入用户名和密码");
    }
  });
};
interface Server {
  server: string;
  token: string;
}
const tokenObj = ref<Server>({
  server: "",
  token: "",
});
const handleGetToken = (event: Server) => {
  tokenObj.value = event;
};
const register = async () => {
  try {
    const req = {
      ...registerForm.value,
      ...tokenObj.value,
      ip: getMathIpv(),
    };
    Reflect.deleteProperty(req, "rePassword");
    const { data, status } = await registerApi(req);
    if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
    if (data.code && data.code !== 200)
      throw new Error(data?.message ?? "位置错误！");
    nMessage.success("注册成功！");
    router.push("/login");
  } catch (error) {
    nMessage.error(error.message);
  }
};
</script>
<style lang="scss" scoped>
::v-deep.n-form-item .n-form-item-label {
  color: #9cc9e5 !important;
}
.form__container {
  padding: 12px;
}

.loading__container {
  margin: 12px auto;
  width: 90%;
}
@function getShadows($n) {
  $shadows: "#{random(100)}vw #{random(100)}vh #fff";
  @for $i from 2 through $n {
    $shadows: "#{$shadows}, #{random(100)}vw #{random(100)}vh #fff";
  }
  @return unquote($shadows);
}
$duration: 400s;
.background-content {
  background: linear-gradient(to bottom, #000, #444, rgb(44, 51, 54));
  width: 100vw;
  padding:24px 0;
  min-height: 100vh;
  $count: 1000;
  overflow: hidden;
  @for $i from 1 through 5 {
    $duration: $duration / 2;
    $count: floor($count / 2);
    .layer#{$i} {
      z-index: 1;
      $size: #{$i}px;
      position: fixed;
      width: $size;
      height: $size;
      border-radius: 50%;
      left: 0;
      top: 0;
      box-shadow: getShadows($count);
      animation: moveUp $duration linear infinite;
      &::after {
        content: "";
        position: fixed;
        left: 0;
        top: 100dvh;
        border-radius: inherit;
        width: inherit;
        height: inherit;
        box-shadow: inherit;
      }
    }
  }
}
.form_warp {
  padding: 24px 0;
  width: 90%;
  left:5%;
  top:80px;
  position: sticky;
  z-index: 2;
  backdrop-filter: blur(30px);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 3%,
    rgba(255, 255, 255, 0) 99%
  );
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-sizing: border-box;
}
@keyframes moveUp {
  to {
    transform: translateY(-100vh);
  }
}
</style>
