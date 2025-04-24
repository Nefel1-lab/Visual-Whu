<template>
  <div class="chart-page">
    <!-- 新增标题 -->
    <div class="page-title">
      非遗文化
    </div>

    <!-- 新增图片容器 -->
    <div class="map-image-container">
      <img src="/data_image/非遗文化地图.png" alt="非遗文化地图" class="map-image" />
    </div>

    <!-- 新增文本框 -->
    <div class="map-text">
      全国非遗项目分布
    </div>
    <div class="map-discri">(暂无台湾非遗项目数据)</div>

    <!-- 新增文本框下方图片 -->
    <div class="map-text-decoration">
      <img src="/map_images/标题修饰.png" alt="标题修饰" class="decoration-image" />
    </div>

    <!-- 新增审图号文本框 -->
    <div class="map-text-bottom">
      审图号：GS（2019）1822号<br />自然资源部 监制
    </div>

    <!-- 右上角容器 -->
    <div class="image-container1 top-right">
      <img src="/data_image/边框4-1.png" alt="边框4" class="border-image" />
    </div>

    <!-- 右下角容器 -->
    <div class="image-container2 bottom-right">
      <!-- 新增标题容器 -->
      <div class="batch-type-title">
        各申报地区不同批次与类型的非遗数量
      </div>
      <img src="/data_image/边框4-1.png" alt="边框1" class="border-image" />
    </div>

    <div class="picchart-container">
      <TypePictorialBar ref="typePictorialBarRef" :data="rawData" @time-selected="handleTimeSelected" />
    </div>
    <div class="barchart-container">
      <BarChart :data="filteredData" @time-selected="handleTimeSelected" @shrink-chart="handleShrinkChart" />
    </div>
    <transition name="fade">
      <div class="timebarchart-container" v-if="showTimeBar">
        <button class="back-button" @click="handleBack">返回</button>
        <TimeBarChart :timeData="selectedTimeData" />
      </div>
    </transition>
    <!-- 新增省份文本框容器 -->
    <div class="right-textbox-container">
      <template v-for="(item, index) in rightTextItems" :key="index">
        <div class="right-textbox-item" 
             :style="getRightTextboxStyle(index)">
          <div class="right-textbox">
            <span 
              :class="{ highlighted: activeProvinceIndex === index }"
              @click="searchByProvince(item.text)"
              @mouseenter="handleProvinceHover(item.text)"
              @mouseleave="handleProvinceLeave" 
            >{{ item.text }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 新增提示框 -->

  </div>
</template>

<script setup>
import BarChart from '../components/BarChart.vue';
import TypePictorialBar from '../components/TypePictorialBar.vue';
import TimeBarChart from '../components/TimeBarChart.vue';
import { ref, onMounted } from 'vue';

const selectedTimeData = ref(null);
const showTimeBar = ref(false);
const rawData = ref([]); // 存储原始数据
const filteredData = ref([]); // 存储过滤后的数据
const typePictorialBarRef = ref(null); // 获取 TypePictorialBar 的引用

// 加载数据
const loadData = async () => {
  try {
    const response = await fetch('/data/非遗项目数据.json');
    if (!response.ok) {
      throw new Error(`无法加载文件: ${response.statusText}`);
    }
    rawData.value = await response.json();
    filteredData.value = rawData.value; // 初始化过滤后的数据
  } catch (error) {
    console.error('读取 JSON 文件失败:', error);
  }
};

// 根据省份过滤数据
const filterDataByProvince = (province) => {
  if (!province) {
    filteredData.value = rawData.value; // 未选择省份时，显示全部数据
    return;
  }
  filteredData.value = rawData.value.filter(item => item.province === province);
};

// 在组件挂载时加载数据
onMounted(() => {
  loadData();
});

// 搜索省份时过滤数据
const searchByProvince = (provinceName) => {
  const cleanName = provinceName.replace(/\s+/g, '');
  activeProvinceIndex.value = rightTextItems.value.findIndex(item => item.text === provinceName);
  filterDataByProvince(cleanName); // 过滤数据
  showTimeBar.value = false; // 新增：重置 TimeBarChart 的状态，确保只显示 BarChart
  handleBack(); // 新增：恢复 BarChart 的原始大小
  console.log('点击的省份 value:', cleanName);
};

// 新增：悬浮省份时高亮
const handleProvinceHover = (provinceName) => {
  const cleanName = provinceName.replace(/\s+/g, '');
};

// 新增：鼠标移开时恢复正常
const handleProvinceLeave = () => {
};

const handleTimeSelected = (timeData) => {
  selectedTimeData.value = timeData;
  showTimeBar.value = true;
};

const handleShrinkChart = () => {
  const barchartContainer = document.querySelector('.barchart-container');
  if (barchartContainer) {
    barchartContainer.style.transform = 'scale(0.64) translateX(-9vw) translateY(1vw)'; // 同时缩小和左移
    barchartContainer.style.transformOrigin = 'center center';
    barchartContainer.style.transition = 'transform 0.5s ease'; // 统一动画时间
  }
};

const handleBack = () => {
  showTimeBar.value = false;
  
  // 恢复 barchart 的大小和位置
  const barchartContainer = document.querySelector('.barchart-container');
  if (barchartContainer) {
    barchartContainer.style.transform = 'scale(1) translateX(0)'; // 恢复大小和位置
    barchartContainer.style.transition = 'transform 0.5s ease'; // 统一动画时间
  }
};

// 新增省份文本框数据
const rightTextItems = ref([
 { text: '新疆', value: '新疆' },
  { text: '西藏', value: '西藏' },
  { text: '内蒙古', value: '内蒙古' },
  { text: '青海', value: '青海' },
  { text: '宁夏', value: '宁夏' },
  { text: '甘肃', value: '甘肃' },
  { text: '四川', value: '四川' },
  { text: '云南', value: '云南' },
  { text: '贵州', value: '贵州' },
  { text: '重庆', value: '重庆' },
  { text: '陕西', value: '陕西' },
  { text: '山西', value: '山西' },
  { text: '湖北', value: '湖北' },
  { text: '湖南', value: '湖南' },
  { text: '海南', value: '海南' },
  { text: '河南', value: '河南' },
  { text: '江西', value: '江西' },
  { text: '河北', value: '河北'},
  { text: '江苏', value: '江苏' },
  { text: '广西', value: '广西'  },
  { text: '北京', value: '北京' },
  { text: '天津', value: '天津'  },
  { text: '安徽', value: '安徽'  },
  { text: '浙江', value: '浙江'   },
  { text: '山东', value: '山东'  },
  { text: '广东', value: '广东'  },
  { text: '福建', value: '福建'   },
  { text: '辽宁', value: '辽宁'    },
  { text: '吉林', value: '吉林'    },
  { text: '黑龙江', value: '黑龙江' },
  { text: '台湾', value: '台湾'   },
  { text: '上海', value: '上海'    },
  { text: '香港', value: '香港'},
  { text: '澳门', value: '澳门' }
]);

// 新增右侧文本框位置配置
const rightTextboxPositions = [
{ top: 30, right: 45 },   // 文本框1
  { top: 48, right: 44 },     // 文本框2
  { top: 31, right: 28 },     // 文本框3
  { top: 41, right:37.5 },   // 文本框4     
  { top: 38, right: 30.5 },     // 文本框5
  { top: 42.5, right: 32 },     // 文本框6
  { top: 51, right: 33 },     // 文本框7
  { top: 61, right: 34   },       // 文本框8
  { top: 57.5 , right:30 },   // 文本框9
  { top: 51.5, right: 29.5 },     // 文本框10
  { top: 44.5, right: 28.5 },     // 文本框11
  { top: 38, right: 26.3 },     // 文本框12
  { top: 49.5, right: 26 },     // 文本框13
  { top: 55, right: 26},   // 文本框14
  { top: 70.5, right: 27.5 },       // 文本框15
  { top: 44.5, right: 25.5 },     // 文本框16
  { top: 54, right: 23},   // 文本框17
  { top: 36, right: 24 },   // 文本框18
  { top: 45, right: 20.5 },   // 文本框19
  { top: 62.5, right: 28 },     // 文本框20
  { top: 32, right: 24 },       // 文本框21
  { top: 34, right: 23 },     // 文本框22
  { top: 48, right: 22 },   // 文本框23
  { top: 51, right: 20 },   // 文本框24
  { top: 39, right:22 },   // 文本框25
  { top: 62, right: 24 },     // 文本框26
  { top: 57.5, right: 21 },   // 文本框27
  { top: 29, right: 19.5 },   // 文本框28
  { top: 24.5, right: 17.5 },       // 文本框29
  { top: 18, right: 17 },   // 文本框30
  { top: 60.5, right: 18.2 },   // 文本框31
  { top: 47.5, right: 18 },     // 文本框32
  { top: 64.5, right: 22 },     // 文本框33
  { top: 66, right: 24.5 },   // 文本框34
];

// 新增获取右侧文本框样式的函数
const getRightTextboxStyle = (i) => {
  const position = rightTextboxPositions[i] || { top: 0, right: 0 };
  return {
    top: `${position.top}vh`,
    right: `${position.right}vw`
  };
};

// 新增当前高亮元素的索引
const activeProvinceIndex = ref(-1);

// 新增搜索省份函数


// 新增提示框相关逻辑


</script>

<style scoped>
.chart-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  position: absolute;
  right: 0vw;
  background-image: url('/map_images/总背景底图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.picchart-container {
  width: 30vw;
  height: 50vh;
  position: absolute;
  right: 5vw;
  top: 10vh;
  z-index: 100;
}

.barchart-container {
  width: 30vw;
  height: 50vh;
  position: absolute;
  bottom: -12vh;
  right: 4vw;
  transition: all 0.5s ease;
  z-index: 1000;
}



.timebarchart-container {
  width: 25vw;
  height: 45vh;
  position: absolute;
  bottom: 4vh;
  right: 7vw; 
  background: transparent; 
  border-radius: 10px;
  box-shadow: none; 
  z-index: 100;
}

.back-button {
  position: absolute;
  bottom: 2vh;
  right:1vw;
  padding: 5px 10px;
  background: #8b0000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 100;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.image-container1 {
  position: absolute;
  width: 34vw; /* 容器宽度 */
  height: 50vh; /* 容器高度 */

}
.image-container2 {
  position: absolute;
  width: 34vw; /* 容器宽度 */
  height: 50vh; /* 容器高度 */

}
.top-right {
  top: 6vh;
  right: 1vw;
}

.bottom-right {
  bottom: 0vh;
  right:0.8vw;
}

.border-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持图片比例 */
}
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}

.map-image-container {
  position: fixed;

  width: 100%;
  height: 120%;
  top: 7vh;
  left: 7vw;
  z-index: 100; /* 确保图片在背景层 */
}

.map-image {

  width: 78%;
  height: 78%;
  object-fit: cover; /* 保持图片比例 */
}

.map-text {
  position: absolute;
  left: 28vw;
  top: 14vh;
  font-family: "MyCustomFont";
  font-size: 1.5vw;
  color: rgb(0, 0, 0); 
  margin: 0;
  padding-left: 1.5vw;
  margin-bottom: -2vh;
}
.map-discri{
  position: absolute;
  left: 28.5vw;
  top: 20vh;
  font-family: "MyCustomFont";
  font-size: 1vw;
  color: rgba(0, 0, 0, 0.614); 
  margin: 0;
  padding-left: 1.5vw;
  margin-bottom: -2vh;
}
.map-text-decoration {
  position: absolute;
  left: 27.5vw;
  top: 16.5vh; /* 放置在文本框下方 */
  z-index: 101; /* 确保图片在文本框上方 */
}

.decoration-image {
  width: 15vw; /* 调整图片宽度 */
  height: auto; /* 保持图片比例 */
}

.map-text-bottom {
  position: absolute;
  left: 18%;
  bottom: 35%;
  font-family: "MyCustomFont";
  font-size: 1vw;
  color: rgb(0, 0, 0); 
  text-align: center; /* 文字居中 */

}

.page-title {
  position: absolute;
  width: 300px;
  padding: 15px;
  top: 10vh;
  left:5vw;
  font-size: 40px;
  font-family: "MyCustomFont";
  color: brown;
}

.batch-type-title {
  position: absolute;
  width: 30vw;
  top: 5vh; /* 放置在容器上方 */
  left: 50%;
  transform: translateX(-50%);
  font-family: "MyCustomFont";
  font-size: 1.5vw;
  color: rgb(0, 0, 0); /* 统一为黑色 */
  text-align: center; /* 文字居中 */
  z-index: 100; /* 确保标题在最上层 */
}

/* 新增右侧文本框样式 */
.right-textbox-container {
  position: absolute;
  left:51vw;
  width: 20vw;
  top: 0vh;
  z-index: 100;
}

.right-textbox-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

}

.right-textbox {
  color: rgb(0, 0, 0);
  writing-mode: horizontal-tb;
  text-orientation: upright;
  min-width: 6vw;
  padding: 0vh 0;
  font-family:"MyCustomFont";
  font-size: 1.1vw;  /* 基础字体大小 */

  transition: all 0.3s ease;  /* 添加过渡效果 */
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  word-break: break-all;
  text-align: center;
  white-space: normal;


}

.right-textbox span {
  display: inline-block;
  transition: inherit;
  cursor: pointer;
}

.right-textbox span.highlighted {
  color: brown; /* 高亮为棕色 */
  transform: scale(1.1); /* 放大1.1倍 */
  font-size: 1.1vw;
}

.right-textbox span:hover {
  color: brown; /* 悬浮时高亮为棕色 */
  transform: scale(1.1); /* 悬浮时放大1.1倍 */
  font-size: 1.1vw;
}

/* 新增提示框样式 */

</style>