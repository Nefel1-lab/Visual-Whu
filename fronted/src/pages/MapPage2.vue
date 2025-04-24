<template>
  <q-page class="q-pa-md policy-page">
    <!-- 删除导航按钮区域代码 -->

    <!-- 标题区域保持不变 -->
    <div class="title-area">
      <h1 class="title-text">地方非遗政策</h1>
      <img src="\map_images\标题修饰.png" alt="标题修饰" class="title-decoration">
    </div>
    <div class="map-container">
      <h1 class="map-name">非物质文化遗产政策地图</h1>
      <h2 class="map-description">
        (暂无港澳台政策数据)
      </h2>
    </div>

    <!-- 恢复搜索框 -->
    <div class="search-area">
      <q-input 
        v-model="searchProvince"
        outlined
        placeholder="输入省份名称"
        class="search-input"
      />
      <q-btn 
        class="search-btn"
        icon="search"
        @click="handleSearch"
      />
    </div>

    <!-- 文本框区域 -->
    <div class="textbox-container">
      <template v-for="(item, index) in textItems" :key="index">
        <div class="textbox-item" 
             :style="{
               ...getTextboxStyle(index+1),
               opacity: showText ? 1 : 0,
               transition: `opacity 0.2s`
             }">
          <img 
            v-if="item.icon" 
            :src="`/map_images/${item.icon}`" 
            class="policy-icon"
            alt="政策图标"
          />
          <div class="textbox" @click="onTextClick(index)">
            {{ item.text }}
          </div>
          <div class="line"></div>
        </div>
      </template>
    </div>

    <!-- 分页控件 -->
    <div class="pagination">
      <button 
        class="prev-btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        title="上一页" 
      />
      <button 
        class="next-btn"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        title="下一页"
      />
      <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
    </div>

    <!-- 中国地图图片容器 -->
    <div class="china-map-container">
      <img 
        src="/map_images/chinamap2.png" 
        alt="中国地图"
        class="china-map-image"
      />
    </div>
    <div class="image1-container">
    <img 
      src="/map_images/图片1.png" 
      alt="图片1"
      class="image1"
    />
  </div>

  <div class="right-textbox-container">
    <template v-for="(item, index) in rightTextItems" :key="index">
      <div class="right-textbox-item" 
           :style="{
             ...getRightTextboxStyle(index),

           }">
        <div class="right-textbox">
          <span 
            :class="{ highlighted: activeProvinceIndex === index }"
            @mouseenter="showTooltip(item)"
            @mouseleave="hideTooltip"
            @click="searchByProvince(item.text)"
          >{{ item.text }}</span>
        </div>
      </div>
    </template>
  </div>

  <!-- 添加提示框 -->
  <div 
    v-if="activeTooltip" 
    class="tooltip" 
    :style="tooltipStyle"
  >
    <div>省份: {{ activeTooltip.text }}</div>
    <div>政策数: {{ activeTooltip.value }}</div>
  </div>
</q-page>
</template>

<style scoped>
/* 新增中国地图容器样式 */
.china-map-container {
  position: absolute;
  right: 2vw;
  bottom: -1.7vh;
  z-index: 1;
}

.china-map-image {
  width: auto;  /* 保持原始尺寸 */
  height: auto; /* 保持原始尺寸 */
  max-width: 100%; /* 防止溢出 */
  max-height: 100%; /* 防止溢出 */
}
</style>

<script setup>
// 删除echarts相关导入
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// 删除chartsDOM和boundaryDOM引用
const showText = ref(false);

const searchProvince = ref('');
const localPolicies = ref([]);

// 文本框数据
const textItems = ref([
  { text: '点击地图省份检索地方政策', url: null, icon: '地方级政策前缀修饰1.png' },  
  { text: '', url: null, icon: '' },
  { text: '', url: null, icon: '' },
  { text: '', url: null, icon: '' }
]);

// 导入本地JSON数据 
// 修改JSON导入路径
import localPoliciesData from '/public/data/_地方非遗政策.json';

// 新增分页相关变量
const currentPage = ref(1);
const pageSize = 4; // 每页显示4条数据
const totalPages = ref(1);

const fetchLocalPolicies = async (province) => {
  try {
    const provinceStr = String(province || '').trim();
    currentPage.value = 1; // 搜索时重置到第一页
    
    // 直接从本地JSON数据中过滤匹配项
    const matchedPolicies = localPoliciesData.filter(item => 
      item.province && item.province.includes(provinceStr)
    );
    
    // 计算总页数
    totalPages.value = Math.ceil(matchedPolicies.length / pageSize);
    localPolicies.value = matchedPolicies;
    
    // 更新当前页数据
    updateCurrentPageData();
  } catch (error) {
    console.error('获取地方政策失败:', error);
    textItems.value = [
      { text: '地方政策', url: null, icon: '地方级政策前缀修饰1.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰2.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰3.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰4.png' }
    ];
  }
};

// 新增分页更新函数
// 修改updateCurrentPageData函数
const updateCurrentPageData = () => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = localPolicies.value.slice(startIndex, endIndex);

  showText.value = false;
  
  setTimeout(() => {
    // 填充4个元素，空数据时保留文本框但内容为空
    textItems.value = Array(4).fill().map((_, index) => {
      if (index < currentData.length && currentData[index]) {
        return {
          text: currentData[index].title || `地方政策${index + 1}`,
          url: currentData[index].url || null,
          icon: `地方级政策前缀修饰${(index % 4) + 1}.png`
        };
      }
      return { text: '', url: null, icon: '' }; // 空数据时保留文本框但内容为空
    });
    
    showText.value = true;
  }, 500);
};

// 修改模板部分


    // 修改changePage函数
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  
  // 先触发淡出动画
  showText.value = false;
  
  // 等待淡出动画完成后再切换页面
  setTimeout(() => {
    currentPage.value = page;
    updateCurrentPageData();
  }, 300);
};

// 修改handleSearch函数
const handleSearch = () => {
  const searchText = String(searchProvince.value || '').trim();
  if (searchText) {
    fetchLocalPolicies(searchText);
  } else {
    // 清空搜索时重置状态
    currentPage.value = 1;
    totalPages.value = 1;
    localPolicies.value = [];
    textItems.value = [
    { text: '地方政策', url: null, icon: '地方级政策前缀修饰1.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰2.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰3.png' },
      { text: '', url: null, icon: '地方级政策前缀修饰4.png' }
    ];
  }
};

// 移除原有的watch监听
// watch(searchProvince, (newVal) => {
//   fetchLocalPolicies(newVal);
// });

const getTextboxStyle = (i) => {
  const positions = [
    { top: 10, left: 6 },   // 第一列位置
    { top: 10, left: 12 },   // 第二列位置
    { top: 10, left: 18 },  // 第三列位置
    { top: 10, left: 24 }   // 第四列位置
  ];
  return {
    top: `${positions[i-1].top}vh`,
    left: `${positions[i-1].left}vw`
  };
};

const onTextClick = (index) => {
  const item = textItems.value[index];
  if (item.url) {
    window.open(`https://www.ihchina.cn/zhengce_details/${item.url}`, '_blank');
  } else {
    console.log('点击了政策:', item.text);
  }
};




onMounted(() => {
  showText.value = true;
  // 删除所有地图初始化代码
  
  // 默认点击北京
  const beijingIndex = rightTextItems.value.findIndex(item => item.text === '北京');
  if (beijingIndex !== -1) {
    searchByProvince(rightTextItems.value[beijingIndex].text);
  }
});
// 添加右侧文本框数据
const rightTextItems = ref([
  { text: '新 疆', value: 1 },
  { text: '西 藏', value: 3 },
  { text: '内 蒙 古', value: 8 },
  { text: '青 海', value: 10 },
  { text: '宁 夏', value: 8 },
  { text: '甘 肃', value: 10 },
  { text: '四 川', value: 9 },
  { text: '云 南', value: 9 },
  { text: '贵 州', value: 7 },
  { text: '重 庆', value: 4 },
  { text: '陕 西', value: 4 },
  { text: '山 西', value: 11 },
  { text: '湖 北', value: 5 },
  { text: '湖 南', value: 4 },
  { text: '海 南', value: 5 },
  { text: '河 南', value: 3 },
  { text: '江 西', value: 4 },
  { text: '河 北', value: 4 },
  { text: '江 苏', value: 3 },
  { text: '广 西', value: 6 },
  { text: '北京', value: 7 },
  { text: '天津', value: 5 },
  { text: '安 徽', value: 5 },
  { text: '浙 江', value: 6 },
  { text: '山 东', value: 9 },
  { text: '广 东', value: 6 },
  { text: '福 建', value: 7 },
  { text: '辽 宁', value: 5 },
  { text: '吉 林', value: 2 },
  { text: '黑 龙 江', value: 5 },
  { text: '台 湾', value: 0 },
  { text: '上海', value: 5 },
  { text: '香港', value: 0 },
  { text: '澳门', value: 0 }
]);


// 右侧文本框位置配置
const rightTextboxPositions = [
  { top: 31.5, right: 46.5 },   // 文本框1
  { top: 51.5, right: 46 },     // 文本框2
  { top: 35.5, right: 28 },     // 文本框3
  { top: 45.5, right: 38.5 },     // 文本框4     
  { top: 42.5, right: 30},     // 文本框5
  { top: 48, right: 31.5 },     // 文本框6
  { top: 57, right: 33.5 },     // 文本框7
  { top: 69, right: 35 },       // 文本框8
  { top: 65.5 , right: 29.5 },     // 文本框9
  { top: 59.5, right: 29 },     // 文本框10
  { top: 49.5 , right: 28 },     // 文本框11
  { top: 42.5, right: 25 },     // 文本框12
  { top: 56 , right: 24.5 },     // 文本框13
  { top: 63.5, right: 25.5 },     // 文本框14
  { top: 81, right: 27 },       // 文本框15
  { top: 50.5, right: 24 },     // 文本框16
  { top: 61.5, right: 21.5 },     // 文本框17
  { top: 40.5, right: 22.5 },     // 文本框18
  { top: 51.5, right: 18.5 },     // 文本框19
  { top: 71.5, right: 28 },     // 文本框20
  { top: 36, right: 22 },       // 文本框21
  { top: 38.5, right: 21 },     // 文本框22
  { top: 54.5, right: 20.5 },   // 文本框23
  { top: 59.5, right: 17.8 },   // 文本框24
  { top: 44.5, right: 20.5 },   // 文本框25
  { top: 71.5, right: 23 },     // 文本框26
  { top: 65.7, right: 19.2 },   // 文本框27
  { top: 32.5, right: 16.5 },   // 文本框28
  { top: 28, right: 14 },       // 文本框29
  { top: 20.5, right: 13.5 },   // 文本框30
  { top: 70.5, right: 16.3 },   // 文本框31
  { top: 54.5, right: 16 },     // 文本框32
  { top: 74.5, right: 21 },     // 文本框33
  { top: 76.5, right: 23.5 },   // 文本框34



];

// 添加获取右侧文本框样式的函数
const getRightTextboxStyle = (i) => {
  const position = rightTextboxPositions[i] || { top: 0, right: 0 };
  return {
    top: `${position.top}vh`,
    right: `${position.right}vw`
  };
};
// 添加当前高亮元素的索引
const activeProvinceIndex = ref(-1);

// 修改 searchByProvince 函数
const searchByProvince = (provinceName) => {
  // 去除省份名称中的空格
  const cleanName = provinceName.replace(/\s+/g, '');
  searchProvince.value = cleanName;
  handleSearch();
  
  // 设置当前高亮元素的索引
  activeProvinceIndex.value = rightTextItems.value.findIndex(item => item.text === provinceName);
};
const activeTooltip = ref(null);
const tooltipStyle = ref({});

const showTooltip = (item) => {
  activeTooltip.value = item;
  updateTooltipPosition();
};

const hideTooltip = () => {
  activeTooltip.value = null;
};

const updateTooltipPosition = () => {
  tooltipStyle.value = {
    position: 'absolute',
    top: `${event.clientY - 50}px`,  // 从+10px改为+5px，减小竖直距离
    left: `${event.clientX + 10}px`
  };
};
</script>

<style scoped>
/* 删除.map-container和.boundary-container样式 */
.policy-page {
  width: 100vw;
  height: 100vh;
  background-image: url('/map_images/总背景底图1.png');
  background-size: cover; /* 修改为cover模式 */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed; /* 添加固定背景 */
  background-size: 100vw 100vh; /* 完全拉伸 */
  background-attachment: scroll; /* 允许滚动 */
}

/* 导航按钮样式 */
.nav-buttons {
  position: absolute;
  top: 2vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;  
  gap: 25vw;
  z-index: 100;
}

.nav-btn {
  padding: 10px 30px;
  background-color: rgba(255, 255, 255, 0.342) !important;
  border-radius: 4px;
  font-family: "SimSun", serif;
  font-size: 1.2vw;
  color: #333 !important;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.nav-btn.active {
  background-color: rgba(233, 213, 181, 0.7) !important;
}

/* 标题区域样式 */
.title-area {
  position: absolute;
  top: 6vh;
  left: 8vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
}

.title-text {
  font-family: "MyCustomFont";
  font-size: 2vw;

  color: brown; /* 统一为棕色 */
  margin: 0;
  padding-left: 1.5vw;
  margin-bottom: -2vh;
}

.title-decoration {
  width: 15vw;
  height: auto;
  margin-left: -0.5vw;
  margin-top: -2.5vh;
}

/* 文本框区域样式 */
.textbox-container {
  position: absolute;
  left: 1vw;
  width: 25vw;
  top: 10vh;
  z-index: 4; /* 从 9999 调整为 100 */
}

.textbox-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;  /* 左对齐 */
}

.textbox {
  writing-mode: vertical-lr;
  text-orientation: upright;
  width: auto;
  min-height: 15vh;
  max-height: 60vh;
  padding: 1vh 0;
  margin-left: 0;
  font-family: "MyCustomFont";
  font-size: 1.1vw;

  transition: all 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
  word-break: break-all;
  text-align: start; /* 修改为居中 */
  white-space: normal;
  display: flex; /* 使用flex布局 */
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

/* 调整文本框容器样式 */
.textbox-item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center; /* 修改为居中 */
  justify-content: center;
  transform: translateX(-50%); /* 保持中间位置不变 */
}

.textbox {
  -webkit-line-clamp: unset;
  line-clamp: unset;
  -webkit-box-orient: unset;
  display: block;
}

.textbox:hover {
  color: #ff6b6b; /* 文字颜色变红 */
  text-shadow: 0 0 5px rgba(255, 107, 107, 0.5); /* 添加文字阴影效果 */
  transform: scale(1.05); /* 轻微放大 */
  cursor: pointer; /* 鼠标指针变为手型 */
}

.line {
  width: 0.05vh;
  height: 6vw;
  margin-left: 0;  /* 去除左边距 */
}

.line::after {
  right: 50%;
  top: 100%;
  transform: translateX(50%);
}

/* 分页控件样式 */
.pagination {
  position: absolute;
  left: 12vw;  /* 与标题区域对齐 */
  bottom: 8vh;  /* 调整为10vh */
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 10;
}

.page-btn {
  padding: 8px 16px;
  background-color: rgba(255,255,255,0.7);
  border-radius: 4px;
  min-width: 40px;
}

.page-info {
  color: #333;
  font-family: "MyCustomFont";
  font-size: 1vw;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 详情区域样式 */
.detail-container {
  position: absolute;
  right: 5vw;
  top: 15vh;
  width: 40vw;
  height: 80vh;
  background: rgba(255, 255, 255, 0.105);
  border-radius: 8px;
  padding: 20px;
  overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 5;
}

.detail-content {
  font-family: "SimSun", serif;
  font-size: 1vw;
  line-height: 1.6;
  white-space: pre-wrap;
  color: #333;
}

/* 地图容器样式 */





.policy-icon {
  width: 1.5vw;  /* 从3vw减小到2vw */
  height: 1.5vw; /* 从3vw减小到2vw */
  margin-bottom: 1vh;
  object-fit: contain;
}


/* 添加搜索框样式 */
/* 搜索框样式优化 */
.search-area {
  position: absolute;
  top: 8vh;
  right: 20vw;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0); /* 添加背景色 */
  border-radius: 20px; /* 添加圆角 */
  padding: 8px 12px; /* 添加内边距 */

}

.search-input {
  width: 20vw;
  background: rgba(255, 255, 255, 0);
  border-radius: 20px;
  font-size: 1.2vw;

  padding: 8px 20px;
  font-family: "MyCustomFont"; /* 添加字体样式 */
}

.search-btn {
  padding: 15px 15px;
  border-radius: 20px;
  font-family: "MyCustomFont"; /* 添加字体样式 */
  font-size: 1.2vw; /* 调整字体大小 */
  color: #333; /* 添加字体颜色 */

}

.search-btn:hover {
  background-color: rgba(233, 213, 181, 0.7); /* 添加悬停效果 */
}

.prev-btn, .next-btn {
  width: 40px;
  height: 40px;
  background: url('/map_images/翻页按键.png') no-repeat center; /* 修正图片路径 */
  background-size: contain;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10000;
}

.prev-btn {
  left: -3vw;
  transform: translateY(-50%) rotate(90deg);
}

.next-btn {
  right: -3vw;
  transform: translateY(-50%) rotate(-90deg);
}


.textbox:empty {
  visibility: hidden; /* 隐藏空文本框内容 */
}

.image1-container {
  position: absolute;
  right: 43vw;  /* 调整位置避免重叠 */
  bottom: 0vh;
  z-index: 5;
}

.image1 {
  width: auto;
  height: auto;
  max-width: 70%;
  max-height: 70%;
}

/* 添加右侧文本框样式 */
.right-textbox-container {
  position: absolute;
  right: 1vw;
  width: 25vw;
  top: 10vh;
  z-index: 5;
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
  min-width: 4vw;
  padding: 0vh 0;
  font-family:"MyCustomFont";
  font-size: 1vw;  /* 基础字体大小 */

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
  cursor: pointer; /* 添加手型光标 */
}

.right-textbox span:active {
  transform: scale(0.95); /* 点击时轻微缩小 */
  transition: transform 0.1s ease; /* 快速过渡效果 */
}
/* 添加高亮样式 */
.right-textbox span.highlighted {
  color: rgb(171, 24, 24);
  text-shadow: 0 0 5px rgb(248, 240, 240);
  transform: scale(1.05);
  font-size: 1.1vw;
}
</style>

<style scoped>
/* 添加提示框样式 */
.tooltip {
  position: absolute;
  background: rgba(255, 255, 255, 0.884);
  border: 1px  #dddddd67;
  border-radius: 4px;
  padding: 4px 12px;  /* 将上下padding从8px改为4px */
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
  font-family:  serif;
  font-weight: bold;
  font-size: 0.9vw;
  color: #000000;
  pointer-events: none;

}

.tooltip div {
  margin: 2px 0;  /* 从4px改为2px */
}

/* 保持原有的右侧文本框样式不变 */
.right-textbox {
  color: rgb(0, 0, 0);
  writing-mode: horizontal-tb;
  text-orientation: upright;
  min-width: 4vw;
  padding: 0vh 0;
  font-family: serif;
  font-size: 1vw;  /* 基础字体大小 */
  font-weight: bold;
  transition: all 0.3s ease;  /* 添加过渡效果 */
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  word-break: break-all;
  text-align: center;
  white-space: normal;
}

.right-textbox span {
  display: inline-block;  /* 确保transform能正常工作 */
  transition: inherit;   /* 继承父元素的过渡效果 */
}

.right-textbox span:hover {
  color: rgb(171, 24, 24);
  text-shadow: 0 0 5px rgb(248, 240, 240);
  transform: scale(1.05);  /* 轻微放大 */
  font-size: 1.1vw;       /* 字体放大0.1vw */
  cursor: pointer;
}
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}

.map-container {
  position: absolute;
  right: 26.5vw;
  top: 28vh;
  z-index: 1000;
}

.map-name{
  font-family: "MyCustomFont";
  font-size: 1.5vw;
  color: rgb(0, 0, 0); /* 统一为棕色 */
  margin: 0;
  padding-left: 1.5vw;
  margin-bottom: -7vh;
}
.map-description{
  font-family: "MyCustomFont";
  font-size: 1vw;
  color: rgba(0, 0, 0, 0.598); /* 统一为棕色 */
  padding-left: 5vw;

}


.mapdetail-container {
  position: absolute;
  right: 5.1vw;
  bottom: -0.5vh;
  z-index: 1000;
}
.mapdetail-container2 {
  position: absolute;
  right: 5vw;
  bottom: -1.4vh;
  z-index: 1000;
}
.mapdetail-name{
  font-family: "MyCustomFont";
  font-size: 0.5vw;
  color: rgb(0, 0, 0); /* 统一为棕色 */
  margin: 0;
  padding-left: 1.5vw;


}
.mapdetail-name2{
  font-family: "MyCustomFont";
  font-size: 0.4vw;
  color: rgb(0, 0, 0); /* 统一为棕色 */
  margin: 0;
  padding-left: 1.5vw;


}
</style>

