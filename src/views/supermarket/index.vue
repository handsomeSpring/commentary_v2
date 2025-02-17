<template>
  <nor-header title="兑换中心" activeMenu="2">
    <full-screen-loading v-if="loading"></full-screen-loading>
    <div class="super-container">
      <aside>
        <li
          v-for="(item, index) in menuList"
          :class="activeValue === item.value ? 'active' : ''"
          :key="index"
          @click="changeMenu(item.value)"
        >
          {{ item.label }}
        </li>
      </aside>
      <main>
        <div
          v-if="activeGoodsList.length > 0"
          class="goods-container"
          v-for="(item, index) in activeGoodsList"
          :key="index"
        >
          <div class="img-wrap">
            <img src="/logo/asg.png" />
          </div>
          <div class="introduction">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
            <p>{{ item.information }}</p>
            <div class="operation">
              <p class="money">{{ item.price }}</p>
              <div class="operation-wrap">
                <n-icon
                  v-show="item.num > 0"
                  :size="22"
                  color="#d4d4d4"
                  :component="RemoveCircle"
                  @click="handleMinus(item)"
                />
                <h4 v-show="item.num > 0">{{ item.num }}</h4>
                <n-icon
                  :size="22"
                  color="#9cc9e5"
                  :component="AddCircle"
                  @click="handleAdd($event, item)"
                />
              </div>
            </div>
          </div>
        </div>
        <asg-empty
          style="margin-top: 24px"
          v-else
          description="暂无商品，请联系主办方"
        ></asg-empty>
      </main>
    </div>
    <footer>
      <div class="left-container">
        <div class="outer-card" @click="active = !active">
          <div class="inner-card">
            <n-icon
              class="cart-icon"
              :size="32"
              color="#fff"
              :component="CartSharp"
            />
            <div class="total-number">
              {{ car.totalNum > 99 ? 99 : car.totalNum }}
            </div>
          </div>
        </div>
        <div class="total-money">
          <p>总积分：{{ car.totalPrice }}</p>
          <p class="lower-price">最低兑换额：{{ car.lowerPrice }}积分</p>
        </div>
      </div>
      <div
        class="right-container"
        :class="!car.isExceedLowerPrice() ? 'disabled' : ''"
        @click="handleBuy"
      >
        <p class="buy-total">去结算</p>
      </div>
    </footer>
  </nor-header>

  <n-drawer
    :height="450"
    v-model:show="active"
    :z-index="99"
    placement="bottom"
    :trap-focus="false"
    :block-scroll="false"
  >
    <n-drawer-content>
      <template #header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            width: 80vw;
            align-items: center;
          "
        >
          <p>我的购物车</p>
          <n-button
            strong
            secondary
            type="error"
            size="small"
            :disabled="car.totalNum === 0"
            @click="clearCart"
            >清空购物车
          </n-button>
        </div>
      </template>
      <ul class="drawer-body-class" v-if="myChooseGoodsList.length > 0">
        <li
          class="goods-container"
          v-for="(item, index) in myChooseGoodsList"
          :key="index"
        >
          <h4>{{ item.name }}</h4>
          <div class="introduction">
            <img src="/logo/asg.png" />
            <div class="text-wrap-container">
              <p class="cart-intro">{{ item.description }}</p>
              <div class="operation-item">
                <p class="money">积分：{{ item.price }}</p>
                <div class="operation-wrap">
                  <n-icon
                    :size="22"
                    color="#d4d4d4"
                    :component="RemoveCircle"
                    @click="cardRemove(item)"
                  />
                  <h4>{{ item.num }}</h4>
                  <n-icon
                    :size="22"
                    color="#9cc9e5"
                    :component="AddCircle"
                    @click="cardAdd(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else>
        <asg-empty description="购物车空空的">
          <template #extra>
            <n-button size="small" @click="active = false"> 去购物吧 </n-button>
          </template>
        </asg-empty>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- 动画小球 -->
  <div v-show="animationShow" class="plus">
    <n-icon
      class="iconfont"
      :size="24"
      color="#9cc9e5"
      :component="AddCircle"
    />
  </div>
</template>

<script setup lang="ts">
import { CartSharp, AddCircle, RemoveCircle } from "@vicons/ionicons5";
import { Goods, Car } from "./superMarket";
import insGoodsInterface from "./superMarket";
import { buyGoods, getStore } from "@/api/supermarket";
import { getByCode } from "@/api/common";
import { useMessage } from "naive-ui/es/message";
import { useUserStore } from "@/store/user";
const loading = ref(false);
const userStore = useUserStore();
const nMessage = useMessage();
const goodsList = ref([]); // 所有的goodsList
const activeGoodsList = ref([]); //激活菜单的goodsList
const menuList = ref([]);
const activeValue = ref("");
(function doGetByCode() {
  loading.value = true;
  getByCode("goodsType").then((res) => {
    menuList.value = res.data.filter((item) => item.value !== "teamLead");
    activeValue.value = menuList.value[0].value;
    loading.value = false;
  });
})();
const myChooseGoodsList = computed(() => {
  return goodsList.value.filter((item: insGoodsInterface) => item.num > 0);
});

const initGoodsList = async () => {
  try {
    goodsList.value = [];
    const { status, data } = await getStore();
    if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
    for (const item of data) {
      const goods = new Goods(item);
      goodsList.value.push(goods);
    }
    if (activeValue.value) {
      activeGoodsList.value = goodsList.value.filter(
        (item) => item.type === activeValue.value
      );
      car.fillInstance(goodsList.value);
    }
  } catch (error) {
    nMessage.error(error instanceof Error ? error.message : error);
  }
};
const car = new Car(goodsList.value, 10);
const totalPriceRef = ref(0);
watch(
  () => goodsList.value,
  () => {
    car.getTotalPrice();
    car.getTotalNum();
  },
  { deep: true }
);
watch(
  () => menuList.value,
  () => {
    initGoodsList();
  },
  { deep: true }
);

const changeMenu = (value: string) => {
  activeValue.value = value;
  activeGoodsList.value = goodsList.value.filter(
    (item: insGoodsInterface) => item.type === activeValue.value
  );
};
const animationShow = ref(false);

// 添加商品
const handleAdd = (e: Event, item: insGoodsInterface) => {
  if (animationShow.value) {
    nMessage.warning("请勿点击太快");
    return;
  }
  const cartIcon = document.querySelector(".cart-icon") as HTMLElement;
  cartIcon.classList.remove("animation");
  item.increaseNum();
  const BALL_PLUS = 12;
  animationShow.value = true;
  const div = <HTMLImageElement>document.querySelector(".plus");
  const car = <HTMLImageElement>document.querySelector(".outer-card");
  const dom = e.target as HTMLElement;
  const btnRect = dom.getBoundingClientRect();
  const left = btnRect.left + btnRect.width / 2 - BALL_PLUS,
    top = btnRect.top - BALL_PLUS;
  const carRect = car.getBoundingClientRect();
  const x = carRect.left + carRect.width / 2 - BALL_PLUS - left,
    y = carRect.top - BALL_PLUS - top;
  div.style.setProperty("--left", `${left}px`);
  div.style.setProperty("--top", `${top}px`);
  div.style.setProperty("--x", `${x}px`);
  div.style.setProperty("--y", `${y}px`);
  div.addEventListener("animationend", () => {
    cartIcon.classList.add("animation");
    animationShow.value = false;
  });
};
// 减少商品
const handleMinus = (item: insGoodsInterface) => {
  if (animationShow.value) {
    nMessage.warning("请勿点击太快");
    return;
  }
  item.decreaseNum();
};
// 清空购物车
const clearCart = () => {
  car.clearCart();
};
// 购物车上添加
const cardRemove = (item: insGoodsInterface) => {
  item.decreaseNum();
};
const cardAdd = (item: insGoodsInterface) => {
  item.increaseNum();
};
const active = ref(false);
// 结算
const handleBuy = async () => {
  try {
    if (!car.isExceedLowerPrice()) return;
    // if (
    //   !(
    //     userStore.userInfo.officium &&
    //     userStore.userInfo.officium === "Commentator"
    //   )
    // ) {
    //   return nMessage.error("兑换失败，您不是解说，无法购物兑换");
    // }
    if (Number(userStore.userInfo.money) < car.totalPrice.value)
      return nMessage.error("兑换失败，积分不足");
    const goodsId = car.getGoodsIds();
    const { status } = await buyGoods(goodsId);
    if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
    clearCart(); // 清空购物车
    nMessage.success("购买成功！");
  } catch (error) {
    if (
      error instanceof Object &&
      "data" in error &&
      error.data instanceof Object &&
      "message" in error.data &&
      typeof error.data.message === "string"
    ) {
      throw new Error(error.data.message);
    }
    if (error instanceof Object && "status" in error && error.status === 500) {
      throw new Error("服务端错误，请联系网站管理员");
    }
    nMessage.error("未知错误，请联系网站管理员");
  }
};
</script>
<style scoped lang="scss">
.super-container {
  height: calc(100dvh - 52px - 4em);
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 23% 77%;

  aside {
    width: 100%;
    box-sizing: border-box;
    background: #e7e7e7;
    box-shadow: 3px 0 5px #8c8c8c inset;
    height: 100%;

    li {
      box-sizing: border-box;
      color: #8c8c8c;
      height: 55px;
      width: calc(100% + 1px);
      display: flex;
      justify-content: center;
      align-items: center;

      &.active {
        box-shadow: 3px 0 0 #9cc9e5 inset;
        background: #fff;
        color: #000;
        font-weight: bold;
      }
    }
  }

  main {
    width: 100%;

    .goods-container {
      display: grid;
      grid-template-columns: 80px calc(100% - 80px);
      padding: 12px 24px;

      .img-wrap {
        width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 68px;
          height: 68px;
        }
      }

      .introduction {
        .operation {
          display: flex;
          justify-content: space-between;

          .money {
            font-size: 1.1em !important;
            font-weight: bold;
            color: #f40;

            &::after {
              content: "积分";
              color: #f40;
              font-size: 0.6em;
              margin-left: 0.5em;
            }
          }

          .operation-wrap {
            display: flex;
            justify-content: space-around;
            align-items: center;
            gap: 0.5em;
          }
        }

        p {
          width: 100%;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #8c8c8c;
          white-space: nowrap;
          font-size: 0.7em;
        }
      }
    }
  }
}

footer {
  height: 50px;
  width: 100%;
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 70% 30%;
  position: fixed;
  bottom: 4em;
  z-index: 999;

  .left-container {
    background: #000;
    width: 100%;
    height: 100%;
    position: relative;

    .outer-card {
      position: absolute;
      left: 20px;
      top: -20px;
      border-radius: 50%;
      background: #000;
      width: 55px;
      height: 55px;
      display: flex;
      justify-content: center;
      align-items: center;

      .inner-card {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #9cc9e5;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .total-number {
          position: absolute;
          top: 5px;
          right: 0;
          padding: 1px 3px;
          width: calc(1.6em - 6px);
          height: calc(1.6em - 2px);
          background: rgb(249, 73, 33);
          border-radius: 50%;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.8em;
        }
      }
    }

    .total-money {
      margin-left: 100px;
      color: #fff;
      height: 100%;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;

      .lower-price {
        font-size: 0.7em;
        color: #e7e7e7;
      }
    }
  }

  .right-container {
    background: rgb(35, 220, 81);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &.disabled {
      background: #cae5d3;
    }

    .buy-total {
      font-size: 1.1em;
      font-weight: bold;
      color: #fff;
    }
  }
}

// 动画小球
.plus {
  position: fixed;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  left: var(--left);
  top: var(--top);

  .iconfont {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}

@keyframes moveY {
  to {
    transform: translateY(var(--y));
  }
}

.plus {
  animation: moveY 0.5s cubic-bezier(0.5, -0.5, 1, 1);
}

@keyframes moveX {
  to {
    transform: translateX(var(--x));
  }
}

.plus .iconfont {
  animation: moveX 0.5s linear;
}

@keyframes boom {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.cart-icon.animation {
  animation: boom 0.26s linear;
}

// 抽屉购物车
.drawer-body-class {
  padding-bottom: 118px;

  .goods-container {
    margin: 12px 0;

    .introduction {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 20px;

      img {
        height: 80px;
        width: 80px;
      }

      .text-wrap-container {
        width: calc(100vw - 120px);

        .cart-intro {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          font-size: 0.8em;
          overflow: hidden;
        }

        .operation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .money {
            font-size: 1.1em;
            color: #f40;
            font-weight: bold;
          }

          .operation-wrap {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
          }
        }
      }
    }
  }
}
</style>
