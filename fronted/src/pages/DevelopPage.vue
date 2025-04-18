<template>
  <q-page class="q-pa-md policy-page">
    <!-- 修改左上角文本框 -->
    <div class="left-top-text-container">
      <div class="text-box text-box-1">民族习俗</div>
      <div class="text-box text-box-2" :style="{opacity: textBoxOpacity}">{{ textBox1Content }}</div>

    </div>
    <!-- 添加中央图片 -->
    <div class="center-image-container">
      <img 
        src="/map_images/axis_inner.png" 
        alt="时期文本"
        class="center-image"
      />
    </div>
    <!-- 添加中央文本框 -->
    <!-- 修改中央文本框模板 -->
    <div class="center-text-containers">
      <div 
        v-for="(timeItem, index) in timeCategories" 
        :key="index"
        class="center-text-container"
        :style="getCenterTextStyle(index, timeCategories.length)"
        @click="toggleCenterBox(index)"
      >
        <div 
          class="center-text-box"
          :style="{
            backgroundImage: `url(${boxStates[index].isBorder0 ? '/deve_images/border0.png' : '/deve_images/border1.png'})`,
            color: boxStates[index].isBorder0 ? 'brown' : 'rgb(235,212,176)'
          }"
        >
          {{ timeItem }}
        </div>
      </div>
    </div>

    <!-- 修改右侧文本框模板 -->
    <div class="right-text-container" :style="{opacity: rightTextOpacity, transition: 'opacity 0.3s ease'}">
      <div v-for="(item, index) in rightTextItems" :key="index" class="right-text-item">
        <div class="right-text-type">{{ item.type }}</div>
        <div class="right-text-content">{{ item.content }}</div>
      </div>
    </div>

    <!-- 将右侧文本框移出对称图片容器 -->
    <div class="symmetrical-images">
      <img 
        src="/deve_images/title_line.png" 
        class="symmetrical-image left-image"
        alt="左侧装饰线"
      />
      <!-- 修改中间文本框 -->
      <div class="middle-text-box" :style="{opacity: middleTextOpacity}">{{ middleTextContent }}</div>
      <img 
        src="/deve_images/title_line.png" 
        class="symmetrical-image right-image"
        alt="右侧装饰线"
      />

      <!-- 修改时间线文本框容器 -->
      <div class="timeline-texts-container">
        <div 
          class="timeline-item-container" 
          v-for="(item, index) in timelineItems" 
          :key="index"
          :style="{...getTimelineTextStyle(index, timelineItems.length), opacity: item.visible ? 1 : 0}">
          
          <!-- 添加标题文本框 -->
          <div class="timeline-title-container">
            <div class="timeline-title">{{ item.title }}</div>
          </div>
          
          <div class="timeline-image-container" v-if="item.image">
            <img 
              :src="`/deve_images/${festivalName}图片/${item.image}.png`" 
              :alt="`${festivalName}习俗图片`"
              class="timeline-image"
            />
          </div>
          <div class="timeline-text">{{ item.content }}</div>
        </div>
      </div>
    </div>
    <!-- 添加右上角选择栏 -->
    <div class="selection-container">
      <q-select
        v-model="festivalName"
        :options="festivalOptions"
        label="选择节日"
        dense
        outlined
        @update:model-value="handleFestivalChange"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import festivalData from '/public/data/习俗.json'; // 修改为融合后的习俗.json
import geneData from '/public/data/基因图谱.json'; // 修改为融合后的基因图谱.json

// 修改节日名称和选项
const festivalName = ref(Object.keys(festivalData)[0]); // 默认选择第一个节日
const festivalOptions = ref(Object.keys(festivalData)); // 从JSON中获取所有节日选项

// 处理节日变化
const handleFestivalChange = () => {
  // 重新加载数据
  loadData();
};

// 加载数据函数
const loadData = () => {
  const times = new Set();
  festivalData[festivalName.value].forEach(item => {
    times.add(item.time);
  });
  timeCategories.value = Array.from(times);
  
  // 初始化每个文本框的状态
  boxStates.value = timeCategories.value.map(() => ({
    isBorder0: true
  }));

  // 自动触发第一个center-text的点击状态
  if (timeCategories.value.length > 0) {
    toggleCenterBox(0);
  }
};

const timeCategories = ref([]);

// 加载并处理数据
const boxStates = ref([]);

// 初始化文本框状态
onMounted(() => {
  const times = new Set();
  festivalData[festivalName.value].forEach(item => {
    times.add(item.time);
  });
  timeCategories.value = Array.from(times);
  
  // 初始化每个文本框的状态
  boxStates.value = timeCategories.value.map(() => ({
    isBorder0: true
  }));

  // 新增：自动触发第一个center-text的点击状态
  if (timeCategories.value.length > 0) {
    toggleCenterBox(0); // 触发第一个选项的点击
  }
});

const textBox1Content = ref("文本框1"); // 添加标题状态

const middleTextContent = ref("发展历程"); // 添加中间文本框状态

const timelineItems = ref([]); // 修改为存储完整对象

const textBoxOpacity = ref(1);
const middleTextOpacity = ref(1);

// 修改右侧文本框数据获取逻辑
const rightTextItems = ref([]);

// 修改切换函数
const rightTextOpacity = ref(1); // 新增右侧文本框透明度控制

const toggleCenterBox = async (index) => {
  // 同时开始淡出效果
  textBoxOpacity.value = 0;
  middleTextOpacity.value = 0;
  rightTextOpacity.value = 0;
  timelineItems.value.forEach(item => {
    item.visible = false;
  });
  
  // 等待淡出完成
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 更新内容
  boxStates.value.forEach((state, i) => {
    state.isBorder0 = true;
  });
  boxStates.value[index].isBorder0 = !boxStates.value[index].isBorder0;
  textBox1Content.value = timeCategories.value[index];
  const selectedTime = timeCategories.value[index];
  
  // 更新时间线内容
  timelineItems.value = festivalData[festivalName.value]
    .filter(item => item.time === selectedTime)
    .map(item => ({
      ...item,
      visible: true,
      title: item.title || '默认标题', // 确保标题存在
      image: item.image || 'default_image' // 确保图片路径存在
    }));

  // 更新 middleTextContent
  const selectedItem = festivalData[festivalName.value].find(item => item.time === selectedTime);
  middleTextContent.value = selectedItem ? selectedItem.period : "发展历程";

  // 修改：安全地更新右侧文本框内容
  try {
    rightTextItems.value = (geneData[festivalName.value] || [])
      .filter(item => item && item.time === selectedTime)
      .map(item => ({
        type: item.type || '未知类型',
        content: item.content || '暂无内容'
      }));
    
    // 如果没有数据，显示提示
    if (rightTextItems.value.length === 0) {
      rightTextItems.value = [{
        type: '提示',
        content: '该时期暂无基因数据'
      }];
    }
  } catch (error) {
    console.error('加载基因数据失败:', error);
    rightTextItems.value = [{
      type: '错误',
      content: '数据加载失败'
    }];
  }

  // 淡入效果
  textBoxOpacity.value = 1;
  middleTextOpacity.value = 1;
  rightTextOpacity.value = 1;
};

// 计算文本框位置
const getCenterTextStyle = (index, total) => {
  const spacing = 100 / (total + 1);
  const top = spacing * (index + 1);
  return {
    top: `${top}%`,
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
};

// 添加计算时间线文本框位置的函数
const getTimelineTextStyle = (index, total) => {
  const spacing = 100 / (total + 1);
  const top = spacing * (index + 1);
  return {
    top: `${top}%`,
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
};

// 添加右侧文本框数据


const isBorder0 = ref(true);


</script>

<style scoped>
.policy-page {
  width: 100vw;
  height: 100vh;
  background-image: url('/map_images/总背景底图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 添加中央图片样式 */
.center-image-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
.selection-container {
  position: absolute;
  top: 3vw;
  right: 8vw;
  z-index: 30;
  width: 20vw;
  background-color: #ffffff9c;
}

.center-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}

/* 左上角文本框样式 */
.left-top-text-container {
  position: absolute;
  top: 3vw;
  left:8vw;
  z-index: 20;
}

.text-box-1 {
  width: 300px;
  padding: 15px;
  margin-bottom: -20px;
  margin-left: -10px;
  font-size: 40px;
  font-family: "MyCustomFont";
  color: brown;
}
.text-box-2 {
  width: 200px;
  padding: 15px; 
  font-size:28px;
  font-family: "MyCustomFont";
  color:  rgb(120, 117, 117);
  transition: opacity 0.3s ease;

}

/* 添加中央文本框样式 */
.center-text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  width: 200px;
  height: 100px;
  cursor: pointer; /* 添加鼠标指针样式 */
  z-index: 16;
}


/* 修改中央文本框样式 */
.center-text-box {
  width: 100%;
  height: 100%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "MyCustomFont";
  font-size: 24px;
  padding: 30px;
  transition: all 0.3s ease;
}


/* 添加自定义字体 */
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}



/* 添加对称图片样式 */
.symmetrical-images {
  position: absolute;
  top: 25vh;
  left: 7vw;
  transform: translateY(-50%);
  z-index: 15;
  display: flex;
  align-items: center; /* 垂直居中 */
  gap: 2vw; /* 调整间距 */
}

/* 添加中间文本框样式 */
.middle-text-box {
  font-family: "MyCustomFont";
  font-size: 28px;
  color: rgb(118, 69, 5);
  padding: 0 20px;
  white-space: nowrap;
  z-index: 18;
}

/* 修改对称图片样式 */
.symmetrical-image {
  width: 10vw;  /* 从100px增大到150px */
  height: auto;
}

.right-image {
  transform: scaleX(-1); /* 仅保持图片本身的水平翻转 */
}
/* 修改时间线容器样式 */
.timeline-texts-container {
  position: absolute;
  top: 15vh;
  left: 15vw;
  width: 30vw;
  height: 60vh;
  z-index: 0;
}

/* 修改时间线条目样式 */
.timeline-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 12vh;
  width: 100%;
  padding-left: 120px;
  transition: opacity 0.3s ease;
}

/* 添加淡入淡出效果 */
.timeline-text {
  font-family: "MyCustomFont";
  font-size: 20px;
  color: rgb(90, 90, 90);
  line-height: 1.6;
  text-align: left;
  transition: opacity 0.3s ease;
}
/* 添加发展历程下方文本框样式 */
.timeline-text-container {
  position: absolute;
  top: 8vh;
  left:10vw;

  z-index: 15;
  width: 60%;
}

/* 修改图片容器样式 */
.timeline-image-container {
  position: absolute; /* 绝对定位 */
  left: 0; /* 固定在左侧 */
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 8px;
}

.timeline-image {
  max-width: 90%;  /* 限制最大宽度 */
  max-height: 90%; /* 限制最大高度 */
  object-fit: contain;
  border-radius: 5px; /* 图片圆角 */
}
/* 修改时间线文本样式 */
.timeline-text {
  font-family: "MyCustomFont";
  font-size: 20px;
  color: rgb(90, 90, 90);
  line-height: 1.6;
  text-align: left;
  transition: all 0.3s ease; /* 添加过渡效果 */
  opacity: 1; /* 确保初始状态可见 */
}

/* 添加过渡效果 */
.timeline-item-container {
  transition: all 0.3s ease;
}
.text-box-1 {
  transition: opacity 0.3s ease;
  /* 其他样式保持不变 */
}

.middle-text-box {
  transition: opacity 0.3s ease;
  /* 其他样式保持不变 */
}


/* 独立右侧文本框样式 */
.right-text-container {
  position: absolute;
  right: 10vw;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 25vw;
  z-index: 25;
}

.right-text-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.right-text-type {
  padding: 8px 15px;
  background-color: rgba(235, 212, 176, 0.8);
  border-radius: 4px;
  font-family: "MyCustomFont";
  color: brown;
  font-size: 24px;
  background-image: url('/deve_images/title 2.png'); /* 添加背景图片 */
  background-size: contain; /* 确保图片完全显示 */
  background-position: center; /* 背景图片居中 */
  background-repeat: no-repeat; /* 确保图片仅显示一次 */
  width: 100%; /* 宽度占满父容器 */
  height: 100%; /* 高度占满父容器 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-text-content {
  padding: 12px 15px;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 4px;
  font-family: "MyCustomFont";
  color: rgb(90,90,90);
  font-size: 20px;
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.timeline-title-container {
  position: absolute;
  left: 90px; /* 与文本内容对齐 */
  top: -50px; /* 上移位置 */
  width: auto; /* 自动宽度 */
  padding: 5px 15px;
  background-color: rgba(0, 0, 0, 0); /* 添加背景 */
  border-radius: 4px;
}

.timeline-title {
  font-family: "MyCustomFont";
  font-size: 18px;
  color: brown;
  transition: opacity 0.3s ease;
  background-image: url('/deve_images/title 1.png'); /* 添加背景图片 */
  background-size: contain; /* 确保图片完全显示 */
  background-position: center; /* 背景图片居中 */
  background-repeat: no-repeat; /* 确保图片仅显示一次 */
  padding: 10px 20px; /* 调整内边距 */
  border-radius: 4px; /* 圆角效果 */
  width: 100%; /* 宽度占满父容器 */
  height: 100%; /* 高度占满父容器 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
