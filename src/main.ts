import { createApp } from 'vue'
import '@/assets/style/reset.css'
import '@/assets/style/fontHarmonyOS.css'
import App from './App.vue'
import router from "@/router/index"
import naive from 'naive-ui'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

import pinia from './store'  //引入
import NorFooter from "@/components/common/NorFooter.vue"
import NorHeader from "@/components/common/NorHeader.vue"
import navBack from '@/components/common/navBack.vue'
import navBackFix from '@/components/common/navBackFix.vue'
const app = createApp(App);
app.component('nor-footer',NorFooter);
app.component('nor-header',NorHeader);
app.component('nav-back',navBack);
app.component('nav-back-fix',navBackFix);
app.use(pinia)
app.use(router)
app.use(naive)

app.mount('#app')
