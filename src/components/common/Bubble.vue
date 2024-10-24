<template>
    <ul class="bg-bubbles">
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
        <li></li>
		<li></li>
        <li></li>
		<li></li>
        <li></li>
		<li></li>
	</ul>
</template>

<script setup lang='ts'>
</script>
<style scoped lang='scss'>
.bg-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.bg-bubbles li {
  position: absolute;
  list-style: none;
  display: block;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.15);
  bottom: -160px;
  -webkit-animation: square 20s infinite;
  animation: square 20s infinite;
  transition-timing-function: linear;
}
.bg-bubbles li:nth-child(1) {
  left: 10%;
}
.bg-bubbles li:nth-child(2) {
  left: 20%;
  width: 40px;
  height: 40px;
  -webkit-animation-delay: 2s;
          animation-delay: 2s;
  -webkit-animation-duration: 17s;
          animation-duration: 17s;
}
.bg-bubbles li:nth-child(3) {
  left: 25%;
  -webkit-animation-delay: 4s;
          animation-delay: 4s;
}
.bg-bubbles li:nth-child(4) {
  left: 40%;
  width: 35px;
  height: 35px;
  -webkit-animation-duration: 22s;
          animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
.bg-bubbles li:nth-child(5) {
  left: 70%;
}
.bg-bubbles li:nth-child(6) {
  left: 75%;
  width: 66px;
  height: 66px;
  -webkit-animation-delay: 3s;
          animation-delay: 3s;
  background-color: rgba(255, 255, 255, 0.2);
}
.bg-bubbles li:nth-child(7) {
  left: 32%;
  width: 80px;
  height: 80px;
  -webkit-animation-delay: 7s;
          animation-delay: 7s;
}
.bg-bubbles li:nth-child(8) {
  left: 55%;
  width: 12px;
  height: 12px;
  -webkit-animation-delay: 15s;
          animation-delay: 15s;
  -webkit-animation-duration: 22s;
          animation-duration: 22s;
}
.bg-bubbles li:nth-child(9) {
  left: 25%;
  width: 8px;
  height: 8px;
  -webkit-animation-delay: 2s;
          animation-delay: 2s;
  -webkit-animation-duration: 14s;
          animation-duration: 14s;
  background-color: rgba(255, 255, 255, 0.3);
}
.bg-bubbles li:nth-child(10) {
  left: 80%;
  width: 88px;
  height: 88px;
  -webkit-animation-delay: 4s;
          animation-delay: 4s;
}
.bg-bubbles li:nth-child(11) {
  left: 70%;
  width: 40px;
  height: 40px;
  -webkit-animation-delay: 2s;
          animation-delay: 2s;
  -webkit-animation-duration: 19s;
          animation-duration: 19s;
}
.bg-bubbles li:nth-child(12) {
  left: 50%;
  width: 60px;
  height: 60px;
  -webkit-animation-delay: 2s;
          animation-delay: 2s;
  -webkit-animation-duration: 18s;
          animation-duration: 18s;
}
.bg-bubbles li:nth-child(13) {
  left: 77%;
  width: 35px;
  height: 35px;
  -webkit-animation-duration: 15s;
          animation-duration: 15s;
  background-color: rgba(255, 255, 255, 0.33);
}
.bg-bubbles li:nth-child(14) {
  left: 56%;
  width: 75px;
  height: 75px;
  -webkit-animation-duration: 17s;
          animation-duration: 17s;
  background-color: rgba(255, 255, 255, 0.28);
}
.bg-bubbles li:nth-child(15) {
  left: 88%;
  width: 45px;
  height: 45px;
  -webkit-animation-duration: 14s;
          animation-duration: 14s;
  background-color: rgba(255, 255, 255, 0.3);
}
.bg-bubbles li:nth-child(16) {
  left: 10%;
  width: 55px;
  height: 55px;
  -webkit-animation-duration: 22s;
          animation-duration: 22s;
  background-color: rgba(255, 255, 255, 0.25);
}
@-webkit-keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}
@keyframes square {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-700px) rotate(600deg);
  }
}
</style>