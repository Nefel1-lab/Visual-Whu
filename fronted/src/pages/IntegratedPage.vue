<template>
  <div class="integrated-container">
    <!-- 修改导航栏为普通 div -->
    <div class="nav-toolbar">
      <div class="toolbar-content">
        <div class="title-text">中国非物质文化遗产</div>
        <div class="nav-items">
          <div 
            v-for="(page, index) in pages" 
            :key="index"
            class="nav-item"
            :class="{ active: activeIndex === index }"
            @click="activeIndex = index"
          >
            {{ page.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 修改点状导航栏 -->
    <div class="dot-navigation">
      <!-- 添加上方图片 -->
      <div class="nav-image top-image">
        <img src="/images/翻页按键 1.png" alt="翻页按键" />
      </div>

      <div 
        v-for="(page, index) in pages" 
        :key="index"
        class="dot-item"
        @click="activeIndex = index"
      >
        <div class="dot-border" v-show="activeIndex === index">
          <img src="/images/圆边框.png" class="rotating-border" />
        </div>
        <div class="dot" :class="{ active: activeIndex === index }"></div>
        <div class="tooltip">
          {{ page.label }}
        </div>
      </div>

      <!-- 添加下方图片 -->
      <div class="nav-image bottom-image">
        <img src="/images/翻页按键.png" alt="翻页按键" />
      </div>
    </div>

    <!-- 页面内容 -->
    <div 
      v-for="(page, index) in pages" 
      :key="index"
      class="page-section"
      :class="{ active: activeIndex === index }"
      :style="getSectionStyle(index)"
    >
      <!-- 第一个容器直接放置移植后的内容 -->
      <div v-if="index === 0" class="content-container">
        <div class="bg-container"></div>
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
      <!-- 其他容器仍然使用 component -->
      <component v-else :is="page.component" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ContentPage from './ContentPage.vue';
import MapPage1 from './MapPage1.vue';
import MapPage2 from './MapPage2.vue';
import DevelopPage from './DevelopPage.vue';
import DataPage from './DataPage.vue';

const pages = [
  { component: ContentPage, label: '目录 ' },
  { component: DevelopPage, label: '非遗历史' },
  { component: MapPage1, label: '国家政策' },
  { component: MapPage2, label: '地方政策' },
  { component: DataPage, label: '数据分析' }
];

const activeIndex = ref(0);

const handleWheel = (e) => {
  e.preventDefault();
  if (e.deltaY > 0) {
    activeIndex.value = Math.min(activeIndex.value + 1, pages.length - 1);
  } else {
    activeIndex.value = Math.max(activeIndex.value - 1, 0);
  }
};

onMounted(() => {
  const dotNav = document.querySelector('.dot-navigation');
  dotNav.addEventListener('wheel', handleWheel, { passive: false });
});

onUnmounted(() => {
  const dotNav = document.querySelector('.dot-navigation');
  dotNav.removeEventListener('wheel', handleWheel);
});

const getSectionStyle = (index) => {
  return {
    transform: `translateY(${(index - activeIndex.value) * 100}%)`,
    transition: 'transform 1s ease-in-out'
  };
};

// 添加 ContentPage 的函数
const hoverStates = ref({ 1: false, 2: false, 3: false, 4: false });

const handleHover = (index, isHovered) => {
  hoverStates.value[index] = isHovered;
};

const handleClick = (index) => {
  // 根据点击的书签切换到对应的容器
  const targetIndex = {
    1: 1, // 非遗历史
    2: 2, // 国家政策
    3: 3, // 地方政策
    4: 4,  // 数据分析
  };
  activeIndex.value = targetIndex[index];
};

const getAnimationDelay = (index) => {
  const delays = { 1: '-1.8s', 2: '-1.2s', 3: '-4.2s', 4: '-3s' };
  return { animationDelay: delays[index] };
};

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
/* 修改导航栏样式 */
.nav-toolbar {
  background: linear-gradient(135deg, #edd3a1, #b69860);
  width: 100%;
  height: 8%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.toolbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 20px;
}

.title-text {
  left: 5vw;
  font-family: 'MyCustomFont';  
  font-size: 32px;
  color: #8b0000d5;
  margin-right: 40px;
}

.nav-items {
  display: flex;
  gap: 20px;
}

.nav-item {
  padding: 10px 20px;
  cursor: pointer;
  font-family: 'MyCustomFont';
  font-size: 16px;
  color: #8b0000;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(235, 212, 176, 0.3);
}

.nav-item.active {
  background: rgba(235, 212, 176, 0.7);
}
.nav-image {
  width: 30px; /* 与点状导航栏容器大小一致 */
  height: 30px; /* 与点状导航栏容器大小一致 */
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-image img {
  width: 100%; /* 图片宽度与容器相同 */
  height: 100%; /* 图片高度与容器相同 */
  object-fit: contain; /* 保持图片比例 */
}
/* 添加点状导航栏样式 */
.dot-navigation {
  position: fixed;
  left: 2vw;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 5vh;
  z-index: 100;
}

.dot-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 30px;
  width: 30px;
}

.dot-border {
  position: absolute;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 49.5%;
  top: 51%;
  transform: translate(-50%, -50%);
}

.rotating-border {
  width: 120%;
  height: 120%;
  animation: rotate 20s linear infinite;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #644d24;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.dot.active {
  transform: scale(1.1);
  background-color: #8b0000;
}

.tooltip {
  position: absolute;
  left: 40px;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 4px;
  color: #8b0000;
  font-family: 'MyCustomFont';
  font-size: large;
  z-index: 1000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.dot-item:hover .tooltip {
  opacity: 1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 添加 ContentPage 的样式 */

.image-container {
  position: absolute;
  top: 20vh;
  width: 20%;
}

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
  top: 0;
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

.center-image {
  position: relative;
  top: 34.1vh;
  left: 9.1vw;
  transform: translate(-50%, -50%);
  width: 17px;
  height: auto;
}
.integrated-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.page-section {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0.5vh;
  left: 0;
  overflow: hidden;
}

.content-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden; /* 添加 overflow: hidden */
}

.page-section.active {
  z-index: 1;
}

/* 添加上下浮动动画 */
.top-image {
  animation: float-up 2s ease-in-out infinite;
}

.bottom-image {
  animation: float-down 2s ease-in-out infinite;
}

/* 定义动画 */
@keyframes float-up {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-down {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

/* 添加背景图样式 */
.bg-container {
  position: absolute;
  top: -1vh;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background-image: url('/images/背景.png');
  background-size: cover;
  background-position: 30% 20%;
  background-repeat: no-repeat;
  opacity: 0.5;
}
</style>