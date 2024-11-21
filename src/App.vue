<template>
  <n-config-provider
    :date-locale="dateZhCN"
    :locale="zhCN"
    :theme-overrides="themeOverrides"
  >
    <n-dialog-provider>
      <n-message-provider>
        <router-view></router-view>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script setup lang="ts">
import eventEmitter from "@/utils/eventEmitter";
import { type GlobalThemeOverrides, dateZhCN, zhCN } from "naive-ui";
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#9CC9E5",
    primaryColorHover: "#c0dff1",
    primaryColorPressed: "#74a6c3",
    primaryColorSuppl: "#CAE5D3",
  },
  Dialog: {
    iconColorSuccess: "#CAE5D3",
    titleTextColor: "#9CC9E5",
    textColor: "#9CC9E5",
  },
  Button: {
    colorSuccess: "#CAE5D3",
    borderSuccess: "1px solid #CAE5D3",
  },
  Skeleton: {
    color: "#CAE5D3",
    colorEnd: "#9CC9E5",
  },
  Empty: {
    textColor: "#9CC9E5",
    iconColor: "#9CC9E5",
  },
  Tag: {
    textColorInfo: "#9CC9E5FF",
    colorInfo: "#CAE5D34D",
  },
};
</script>
<style scoped lang="scss">
h2 {
  color: #74a6c3;
}
</style>
