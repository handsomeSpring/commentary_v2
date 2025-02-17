<template>
    <nav-back title="我的信息" />
    <full-screen-loading v-if="skeletonLoading" style="width: 6rem;height: 6rem;" :sharp="false">
    </full-screen-loading>
    <n-card v-if="!skeletonLoading && !readOnly" title="我的信息">
        <template #header-extra>
            <n-button disabled size="small" tertiary>
                辞职解说
            </n-button>
        </template>
        <div class="container--flex">
            <n-upload style="width:6em" accept="image/*" color="#8590a6" :custom-request="customRequest"
                :default-file-list="fileList" list-type="image-card" :max="1" @before-upload="beforeAvatarUpload">
                点击上传<br>用户头像
            </n-upload>
            <n-input v-if="isNameEditing" maxlength="8" show-count ref="nameInputRef" v-model:value="nameModel"
                placeholder="请输入新昵称" size="small" @blur="handleInputBlur">
            </n-input>
            <div class="edit__wrap" v-else>
                <p class="name__info">{{ me.chinaname }}</p>
                <p class="edit__btn--color" v-if="!isNameEditing" @click="handleEditClick">
                    编辑
                </p>
            </div>
        </div>
    </n-card>
    <n-card v-if="!skeletonLoading && readOnly" title="我的信息">
        <div class="userInfo__container">
            <n-avatar round :size="48" :src="me.base64" />
            <div class="userInfo__text">
                <p>姓名:{{ me.chinaname }}</p>
                <p>ID:{{ me.id }}</p>
            </div>
        </div>
    </n-card>
    <n-card v-if="!skeletonLoading" title="账号信息">
        <p class="info__p">用户：<span class="user-name-text">{{ me.name }}</span></p>
        <p class="info__p">职位：{{ computedOfficium(me.officium) }}</p>
        <p class="info__p">权限：{{ me.roleListName || '普通用户' }}</p>
        <p class="info__p">qq号：{{ me.qqnumber || '未绑定' }} <span v-show="!readOnly" class="upd_text"
                @click="openDialog">修改</span></p>
        <p class="info__p">身份：{{ computedAdmin(me.roles) }}</p>
        <p class="info__p">积分：{{ me.money || 0 }}</p>
    </n-card>
    <n-modal v-model:show="dialog">
        <n-card title="修改QQ" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <n-input v-model:value="qqnumber" show-count :maxlength="11" type="text" :allow-input="onlyAllowNumber"
                placeholder="请输入qq号" />
            <template #footer>
                <n-button type="info" @click="changeQQ">更改</n-button>
            </template>
        </n-card>
    </n-modal>
</template>

<script setup lang='ts'>
import {
    InputInst,
    type UploadCustomRequestOptions,
    type UploadFileInfo,
    useMessage,
} from 'naive-ui';
import { useUserStore } from '@/store/user';
import { uploadAvatar, updateName } from '@/api/userInfo';

const route = useRoute();
const nameInputRef = ref<InputInst | null>(null);
const userStore = useUserStore();
const nMessage = useMessage();
const fileList = reactive<UploadFileInfo[]>([])
const skeletonLoading = ref(true);
const isNameEditing = ref(false);
const nameModel = ref('');
const roleMap = ref([]);

const getRolesMap = () => {
    try {
        if (sessionStorage.getItem('asg-roleList')) {
            roleMap.value = JSON.parse(sessionStorage.getItem('asg-roleList'));
        } else {
            getByCode('roleList').then(res => {
                sessionStorage.setItem('asg-roleList', JSON.stringify(res?.data ?? []))
                roleMap.value = res.data;
            })
        }
    } catch (error) {
        console.log(error.message,'roleList获取全局参数异常---');
        roleMap.value = [];
    }
}
getRolesMap();
const customRequest = ({ file }: UploadCustomRequestOptions) => {
    if (!file.file) {
        return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file.file)
    reader.addEventListener(
        'load',
        async (event) => {
            const result = event.target?.result
            if (typeof result !== 'string') {
                return
            }
            try {
                await uploadAvatar(result);
                userStore.updateFiled('base64', result);
                nMessage.success('上传成功')
            } catch (error) {
                if (error instanceof Error) {
                    nMessage.error(error.message)
                }
            }
        }
    )
}
const beforeAvatarUpload = (options: {
    'file': UploadFileInfo
}) => {
    const { file } = options.file
    if (!file) {
        return false
    }
    if (file.size > 10 ** 6) {
        nMessage.error('图片文件大小不能大于1MB')
        return false
    }
    return true
}
const me = computed(() => {
    return userStore.userInfo;
})
const readOnly = computed(() => {
    return route.query.type === 'view';
})
onMounted(() => {
    nameModel.value = me.value?.chinaname ?? '';
    const myData = me.value;
    if (myData?.base64) {
        fileList.splice(0)
        fileList.push({
            'id': 'current',
            'name': '头像',
            'status': 'finished',
            'url': myData.base64,
        })
    }
    nextTick(() => {
        skeletonLoading.value = false;
    })
})
const handleInputBlur = async () => {
    if (!nameModel.value) {
        nMessage.error('昵称不能为空')
        nameModel.value = me.value?.chinaname ?? ''
    }
    if (nameModel.value !== me.value?.chinaname) {
        try {
            await updateName(nameModel.value)
            userStore.updateFiled('chinaname', nameModel.value);
            nMessage.success('修改成功')
        } catch (error) {
            if (error instanceof Error) {
                nMessage.error(error.message)
            }
        }
    }
    isNameEditing.value = false
}
const handleEditClick = async () => {
    isNameEditing.value = true
    await nextTick()
    nameInputRef.value?.focus()
}
type Roles = 'nbadmin' | 'admin'
const computedAdmin = (roles: Roles[]) => {
    if (roles.includes('nbadmin')) {
        return '超级管理员';
    }
    if (roles.includes('admin')) {
        return '管理员';
    }
    return '普通人员';
}
const computedOfficium = (officium: string) => {
    return roleMap.value.find(item => item.value === officium)?.label ?? '未知职位';
}
// 修改qq号相关
const dialog = ref(false);
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);
const qqnumber = ref('');
const openDialog = () => {
    dialog.value = true;
    qqnumber.value = me.value.qqnumber ?? '';
}
const changeQQ = async () => {
    try {
        const { status } = await updateQQ(qqnumber.value);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
        userStore.updateFiled('qqnumber', qqnumber.value);
        nMessage.success('修改成功！');
        dialog.value = false;
    } catch (error) {
        nMessage.error(error.message);
    }
}
</script>
<style scoped lang='scss'>
.n-card {
    width: 92%;
    margin: 12px auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .container--flex {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1em;
    }
}

.edit__wrap {
    display: flex;
    justify-content: center;
    align-items: baseline;

    .name__info {
        font-size: 1.3rem;
        font-weight: bold;
    }

    .edit__btn--color {
        color: #4090EE;
        margin-left: 12px;
    }
}

// 查看
.userInfo__container {
    display: grid;
    grid-template-columns: 60px auto;
    gap: 12px;
    align-items: center;
}

.info__p {
    font-size: 1rem;
    margin: 6px 0;

    .user-name-text {
        font-weight: 600;
        font-family: 'HarmonyOS_Regular';
        color: #AED2E8;
    }

    .upd_text {
        margin-left: 12px;
        color: var(--main-theme-text);
        cursor: pointer;
    }
}
</style>