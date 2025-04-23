<template>
  <q-page class="q-pa-md">
    <div class="bg-container"></div>
    <div class="content text-center">
      <!-- 添加4个相同的组件 -->
      <div 
        v-for="i in 4" 
        :key="i" 
        class="image-container" 
        :style="getImageContainerStyle(i)" 
        @mouseenter="() => handleHover(i, true)"
        @mouseleave="() => handleHover(i, false)"
        @click="() => handleClick(i)"
      >
        <div class="flip-card" :style="getAnimationDelay(i)">
          <img 
            :src="`/images/书签${i}.png`" 
            alt="书签" 
            class="front-image" 
            :class="{ 'flipped': hoverStates[i] }"
          />
          <img 
            :src="`/images/书签${i}-1.png`" 
            alt="书签" 
            class="back-image" 
            :class="{ 'flipped': hoverStates[i] }"
          />
          <img src="/images/流苏.png" alt="流苏" class="center-image" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 为每个组件创建独立的悬停状态
const hoverStates = ref({ 1: false, 2: false, 3: false, 4: false });

// 处理悬停事件
const handleHover = (index, isHovered) => {
  hoverStates.value[index] = isHovered;
};

// 处理点击事件
const handleClick = (index) => {
  const routes = {
    1: '/history',
    2: '/map/policy',
    3: '/map/local',
    4: '/data'
  };
  router.push(routes[index]);
};

// 获取动画延迟
const getAnimationDelay = (index) => {
  const delays = { 1: '-1.8s', 2: '-1.2s', 3: '-4.2s', 4: '-3s' }; // 根据动画时长6s计算
  return { animationDelay: delays[index] };
};

// 获取 image-container 的样式
const getImageContainerStyle = (index) => {
  const positions = {
    1: { top: '30vh', left: '10%' },
    2: { top: '22vh', left: '30%' },
    3: { top: '25vh', left: '50%' },
    4: { top: '27vh', left: '70%' }
  };
  return positions[index];
};
</script>

<style scoped>
/* 修改图片容器样式 */
.image-container {
  position: absolute;
  top: 20vh;
  width: 20%; /* 设置宽度 */
}

/* 修改 flip-card 和 front-image 的定位 */

/* 修改 flip-card 动画 */
.flip-card {
  position: absolute;
  width: 300px;
  height: auto;
  transform-style: preserve-3d;
  animation: pendulumZ 6s ease-in-out infinite;
}

@keyframes pendulumZ {
  0%, 100% {
    transform: translateY(0) rotateZ(4deg) rotateY(-10deg);
  }
  50% {
    transform: translateX(33px) rotateZ(-4deg) rotateY(10deg);
  }
}

.front-image, .back-image {
  position: absolute;
  top: 0; /* 确保 front-image 和 back-image 与 flip-card 对齐 */
  left: 0;
  width: 100%;
  height: auto;
  backface-visibility: hidden;
  transition: transform 1s;
}

.front-image {
  transform: rotateY(0deg);
}

.back-image {
  transform: rotateY(180deg);
}

.flipped.front-image {
  transform: rotateY(180deg);
}

.flipped.back-image {
  transform: rotateY(360deg);
}
/* 添加新图片样式 */
.center-image {
  position: relative;
  top: 35vh;
  left: 0.5vw;
  transform: translate(-50%, -50%);
  width: 17px; /* 根据需要调整大小 */
  height: auto;
}
.bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; /* 使用视口高度确保覆盖整个页面 */
  z-index: -1;
  background-image: url('/images/背景.png'); /* 添加背景图 */
  background-size: cover; /* 确保背景图覆盖整个页面 */
  background-position: 30% 20%; /* 将背景图位置设置为30% */
  background-repeat: no-repeat; /* 防止背景图重复 */
  opacity: 0.5; /* 设置背景图半透明 */
}
.content {
  position: relative;
  z-index: 1;
}
h1 {
  color: #ff6b6b;
}
p {
  color: #666;
}
@keyframes bgMove {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
