<template>
    <nav-back title="ASG历届冠军" />
    <template v-if="loading">
        <n-skeleton text :repeat="4" />
        <n-skeleton text style="width: 87%" :repeat="2" />
        <n-skeleton text style="width: 70%" :repeat="2" />
        <n-skeleton text style="width: 50%" />
    </template>
    <div class="main" v-else>
        <n-result v-if="teamList.length === 0" style="margin-top: 30vh;" status="404" title="暂无冠军"
            description="该比赛还没有冠军诞生">
        </n-result>
        <n-timeline v-else>
            <n-alert style="margin:12px 0" title="冠军殿堂" type="warning">
                <template #icon>
                    <n-icon>
                        <Medal />
                    </n-icon>
                </template>
                以下名单是在历届ASG赛事中，取得最好成绩的战队，象征着第五人格ASG赛事的最高荣誉。
            </n-alert>
            <n-timeline-item v-for="team in teamList" :key="team.championId" :title="team.eventName" type="warning"
                :time="team.eventTime">
                <template #icon>
                    <n-icon>
                        <RibbonSharp />
                    </n-icon>
                </template>
                <n-card>
                    <template #header>
                        <div class="header__container">
                            <img :src="team.teamLogo" :onerror="imgOnError" />
                            <div>
                                <h4>{{ team.teamName }}</h4>
                                <p>获赞数量：{{ team.vote }}</p>
                                <p>联系方式：{{ team.teamTel }}</p>
                            </div>
                        </div>
                    </template>
                    <n-divider>
                        <n-tag :bordered="false" type="info">
                            求生者
                        </n-tag>
                    </n-divider>
                    <div class="role__main">
                        <div class="line__role" v-for="role in team.surMemeber" :key="role.roleName">
                            <p>{{ role.roleName }}</p>
                            <p>{{ role.roleHero }}</p>
                            <p>{{ role.rank }}</p>
                        </div>
                    </div>
                    <n-divider>
                        <n-tag :bordered="false" type="error">
                            监管者
                        </n-tag>
                    </n-divider>
                    <div class="role__main">
                        <div class="line__role" v-for="role in team.hunMemeber" :key="role.roleName">
                            <p>{{ role.roleName }}</p>
                            <p>{{ role.roleHero }}</p>
                            <p>{{ role.rank }}</p>
                        </div>
                    </div>
                </n-card>
            </n-timeline-item>
        </n-timeline>
    </div>
</template>

<script setup lang='ts'>
import { RibbonSharp, Medal } from '@vicons/ionicons5';
import defaultImg from '/logo/asg.png';
import { useMessage } from 'naive-ui';
// 定义类型
interface MemberRole {
    rank: string
    roleName: string
    roleHero: string
}
interface Champion {
    championId: number
    message: string
    eventName: string
    eventTime: string
    vote: number
    teamName: string
    teamLogo: string
    teamTel: string
    surMemeber: MemberRole[]
    hunMemeber: MemberRole[]
}
const message = useMessage();
const teamList = ref<Champion[]>([]);
const historyRanks = ref([]);
const loading = ref(false);
const imgOnError = (e) => {
    let img = e.srcElement;
    img.src = defaultImg;
    img.onerror = null; //防止闪图
}
const initData = async () => {
    try {
        loading.value = true;
        const result = await getByCode('historyRank');
        historyRanks.value = result.data;
        const { data, status } = await getChampion();
        if (status !== 200) throw new Error('获取失败，请联系网站管理员');
        teamList.value = data.map(item => {
            return {
                championId: item.id,
                message: item.msg,
                eventName: item.events.name,
                eventTime: item.events.opentime.split('T')[0],
                teamLogo: `https://api.idvasg.cn/loge/${item.events.name}/${item.form.team_name}.png` ,
                teamTel: item.form.team_tel,
                vote: item.form.piaoshu,
                teamName: item.form.team_name,
                surMemeber: item.form.role.filter(el => el.role_lin === '求生者').map(role => {
                    return {
                        rank: historyRanks.value.find(ranks => ranks.value === (role.historical_Ranks ?? -1).toString())?.label ?? '未知段位',
                        roleName: role.role_name,
                        roleHero: role.common_Roles ?? '未公布'
                    }
                }),
                hunMemeber: item.form.role.filter(el => el.role_lin === '监管者').map(role => {
                    return {
                        rank: historyRanks.value.find(ranks => ranks.value === (role.historical_Ranks ?? -1).toString())?.label ?? '未知段位',
                        roleName: role.role_name,
                        roleHero: role.common_Roles ?? '未公布'
                    }
                })
            }
        });
    } catch (error) {
       message.error(error.message);
    } finally {
        loading.value = false;
    }
}
initData();
</script>
<style scoped lang='scss'>
.main {
    padding: 0 12px;
    margin-bottom: 32px;
}

::v-deep .n-card>.n-card-header,
::v-deep .n-card>.n-card__content {
    padding: 12px !important;
}

::v-deep .n-divider:not(.n-divider--vertical) {
    margin: 8px 0 !important
}

.role__main {
    margin: 12px 0;

    .line__role {
        display: grid;
        grid-template-columns: 35% 40% 25%;

        p {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}

.header__container {
    display: flex;
    justify-content: flex-start;

    img {
        width: 80px;
        height: 80px;
        margin-right: 24px;
        border-radius: 8px;
    }

    h4 {
        color: #9CC9E5;
    }

    p {
        color: #979797;
        font-size: 0.8rem;
    }
}
</style>