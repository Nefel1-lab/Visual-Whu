<template>
  <div class="bg-carousel">
    <img 
      v-for="(img, index) in images" 
      :key="index" 
      :src="img" 
      :class="['carousel-image', { active: currentIndex === index }]"
    />
  </div>
  <div class="overlay"></div> <!-- 新增黑色蒙版 -->
  <div class="content text-center" :style="{ opacity: contentOpacity }">
    <div class="main-title">九州非遗志</div>
    <div class="sub-title">——中国非物质文化遗产可视化平台</div>
    <img 
      src="/images/翻页按键.png" 
      alt="翻页按键" 
      class="flip-button" 
      @click="navigateToContent"
    />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleClick = () => {
  router.push('/integrated');
};

const images = [
  '/images/welcome_image/1.png',
  '/images/welcome_image/2.png',
  '/images/welcome_image/3.png',
  '/images/welcome_image/4.png',
  '/images/welcome_image/5.png',
  '/images/welcome_image/6.png',
];

const currentIndex = ref(0);
const contentOpacity = ref(0); // 新增内容透明度控制

const flipButtonAnimation = () => {
  const button = document.querySelector('.flip-button');
  if (button) {
    let direction = 1;
    setInterval(() => {
      const currentY = parseFloat(button.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
      if (currentY > 10) direction = -1;  // 将幅度上限从15改为30
      if (currentY < -10) direction = 1;  // 将幅度下限从-15改为-30
      button.style.transform = `translateY(${currentY + direction * 2}px)`;  // 将每次移动距离从5改为2
    }, 50);  // 将间隔时间从200ms改为100ms
  }
};

onMounted(() => {
  // 初始化第一张图片为可见
  const firstImg = document.querySelector('.carousel-image');
  if (firstImg) {
    firstImg.style.opacity = 0.5;
  }

  setInterval(() => {
    // 先隐藏当前图片
    const currentImg = document.querySelector('.carousel-image.active');
    if (currentImg) {
      currentImg.classList.remove('active');
      currentImg.style.opacity = 0;
    }
    
    // 更新索引
    currentIndex.value = (currentIndex.value + 1) % images.length;
    
    // 显示新图片
    const nextImg = document.querySelectorAll('.carousel-image')[currentIndex.value];
    if (nextImg) {
      nextImg.classList.add('active');
      nextImg.style.opacity = 0.5;
    }
  }, 3000);

  // 修改渐显效果，时长1秒
  let opacity = 0;
  const fadeInInterval = setInterval(() => {
    opacity += 0.02;
    contentOpacity.value = opacity;
    if (opacity >= 1) {
      clearInterval(fadeInInterval);
    }
  }, 20); // 每20ms增加0.02，总共1秒达到1
  flipButtonAnimation();
});

const navigateToContent = () => {
  router.push('/integrated'); // 导航到content页面
};
</script>

<style scoped>
/* 修改内容区域过渡效果 */
.content {
  position: relative;
  z-index: 1;
  transition: opacity 1s ease-in-out; /* 将过渡时间改为1秒 */
}

/* 新增蒙版样式 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.623); /* 黑色半透明 */
  z-index: 0;
}

.bg-carousel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background-image: url('/map_images/总背景底图.png'); /* 新增背景图 */
  background-size: cover; /* 确保背景图覆盖整个页面 */
  background-position: center; /* 背景图居中 */
}

/* 确保轮播图片样式正确 */
.carousel-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.carousel-image.active {
  opacity: 0.5;
}

.content {
  position: relative;
  z-index: 1;
  transition: opacity 0.5s ease-in-out; /* 添加过渡效果 */
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}
/* 新增标题样式 */
.main-title {
  position: absolute;
  top: 40vh;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;

  font-family: 'MyCustomFont';
  color: white;
  text-shadow: 2px 2px 4px rgb(237, 237, 237);
  letter-spacing: 0.2em; /* 新增文字间距 */
}

.sub-title {
  position: absolute;
  font-family: 'MyCustomFont';
  top: 52vh;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  color: rgb(228, 73, 73);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em; /* 新增文字间距 */

}
.flip-button {
  position: absolute;
  top: 72vh;
  left: 48%;
  transform: translateX(-50%);
  width: 50px;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.flip-button:hover {
  transform: translateX(-50%) scale(1.1); 
}
</style>
