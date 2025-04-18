<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="nav-toolbar">
        <q-toolbar-title class="title-text">中国非物质文化遗产</q-toolbar-title>
        <!-- 导航菜单直接放在顶部导航栏 -->
        <q-btn flat label="首页" to="/" />
        <q-btn flat label="非遗历史" to="/history" />
        <q-btn-dropdown flat label="非遗政策" stretch>
          <q-list>
            <q-item clickable v-close-popup to="/map/policy">
              <q-item-section>国家政策</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/map/local">
              <q-item-section>地方政策</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat label="数据分析" to="/data" />
      </q-toolbar>
    </q-header>

    <!-- 添加左侧点状导航 -->
    <div class="dot-navigation">
      <!-- 添加上方图片 -->
      <div class="nav-image top-image">
        <img src="/images/翻页按键 1.png" alt="翻页按键" />
      </div>

      <div 
        v-for="(route, index) in navRoutes" 
        :key="index"
        class="dot-item"
        @click="navigateTo(route.path)"
      >
        <div class="dot-border" v-show="isActive(route.path)">
          <img src="/images/圆边框.png" class="rotating-border" />
        </div>
        <div class="dot" :class="{ active: isActive(route.path) }"></div>
        <div class="tooltip">
          {{ route.label }}
        </div>
      </div>

      <!-- 添加下方图片 -->
      <div class="nav-image bottom-image">
        <img src="/images/翻页按键.png" alt="翻页按键" />
      </div>
    </div>

    <q-page-container class="page-container">
      <transition :name="transitionName" mode="out-in">
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// 修改导入部分，添加onMounted和onUnmounted
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const hoverIndex = ref(-1);
const isTooltipVisible = ref(false);

// 修改工具提示相关方法
const showTooltip = (index) => {
  hoverIndex.value = index;
  isTooltipVisible.value = true;
};


// 添加当前路由判断
const isActive = (path) => {
  return route.path === path || 
         (path ===  route.path.startsWith('/map'));
};

// 导航数据
const navRoutes = [
  { path: "/", label: "首页" },
  { path: "/history", label: "非遗历史" },
  { path: "/map/policy", label: "国家政策" },
  { path: "/map/local", label: "地方政策" },
  { path: "/data", label: "数据分析" }
];

const navigateTo = (path) => {
  router.push(path);
};

const transitionName = ref('slide-down');

// 监听路由变化
watch(() => router.currentRoute.value.path, (to, from) => {
  const toIndex = pageRoutes.indexOf(to);
  const fromIndex = pageRoutes.indexOf(from);
  
  if (toIndex > fromIndex) {
    transitionName.value = 'slide-up';
  } else {
    transitionName.value = 'slide-down';
  }
});

// 页面路由顺序
const pageRoutes = [
  "/",          // 首页
  "/history",   // 非遗历史
  "/map/policy",// 国家政策
  "/map/local", // 地方政策
  "/data"       // 数据分析
];

// 添加滚轮事件处理
const handleWheel = (e) => {
  // 阻止默认滚动行为
  e.preventDefault();
  
  const currentIndex = pageRoutes.indexOf(route.path);
  if (currentIndex === -1) return;
  
  if (e.deltaY > 0) {
    // 向下滚动 - 下一页
    const nextIndex = Math.min(currentIndex + 1, pageRoutes.length - 1);
    router.push(pageRoutes[nextIndex]);
  } else {
    // 向上滚动 - 上一页
    const prevIndex = Math.max(currentIndex - 1, 0);
    router.push(pageRoutes[prevIndex]);
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
</script>

<style scoped>
/* 左侧点状导航样式 */
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

/* 添加导航图片样式 */
.nav-image {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-image img {
  width: 100%; /* 图片宽度与容器相同 */
  height: 100%; /* 图片高度与容器相同 */
  object-fit: contain; /* 保持图片比例 */
}

/* 上方图片动画 */
.top-image {
  animation: float-up 2s ease-in-out infinite;
}

/* 下方图片动画 */
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

.dot-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center; /* 添加居中 */
  cursor: pointer;
  height: 30px;
  width: 30px; /* 固定宽度 */
}


/* 修改点状导航样式 */
.dot-border {
  position: absolute;
  width: 30px;
  height:30px;
  display: flex;
  align-items: center;
  justify-content: center;
  left:49.5%;
  top: 51%;
  transform: translate(-50%, -50%);
}



/* 调整旋转动画速率 */
.rotating-border {
  width: 120%;
  height: 120%;
  animation: rotate 20s linear infinite; /* 从8s改为12s，减慢旋转速度 */
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
  display: flex;
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}



/* 修改提示框样式 */
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
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.2s ease;
}

.dot-item:hover .tooltip {
  opacity: 1; /* 鼠标悬停时显示 */
}

/* 修改页面切换动画 */
.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
  height: 100%;
}

/* 下一页进入动画 - 从底部进入 */
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-enter-to {
  transform: translateY(0);
}

/* 下一页退出动画 - 向上移出 */
.slide-up-leave-active {
  z-index: 1;
}
.slide-up-leave-from {
  transform: translateY(0);
}
.slide-up-leave-to {
  transform: translateY(-100%);
}

/* 上一页进入动画 - 从顶部进入 */
.slide-down-enter-from {
  transform: translateY(-100%);
}
.slide-down-enter-to {
  transform: translateY(0);
}

/* 上一页退出动画 - 向下移出 */
.slide-down-leave-active {
  z-index: 1;
}
.slide-down-leave-from {
  transform: translateY(0);
}
.slide-down-leave-to {
  transform: translateY(100%);
}

/* 添加过渡效果 */
.drawer-transition {
  transition: all 0.3s ease;
}

/* 调整导航栏样式 */
.q-drawer {
  width: 200px !important;  /* 设置固定宽度 */
  min-width: 200px;  /* 防止内容挤压 */
}

/* 添加背景图样式 */
.q-layout {
  background-image: url('/map_images/总背景底图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 调整页面容器样式 */
.page-container {
  background-color: rgba(255, 255, 255, 0); /* 半透明白色背景 */
  backdrop-filter: blur(2px); /* 背景模糊效果 */
}

/* 保持原有的页面切换动画和背景样式 */
.nav-toolbar {
  background: linear-gradient(135deg, #edd3a1, #b69860);
  width: 100%;
  gap: 40px;
  justify-content: center;
}

.title-text {
  font-family: "SimSun", serif;
  font-weight: bold;
  color: #8b0000d5;
  margin-right: 40px;
}
</style>
