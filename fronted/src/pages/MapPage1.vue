<template>
  <q-page class="q-pa-md policy-page">
    <!-- 新增按钮导航区域 -->


    <!-- 左上角标题区域 -->
    <div class="title-area">
      <h1 class="title-text">国家非遗政策</h1>
      <img src="\map_images\标题修饰.png" alt="标题修饰" class="title-decoration">
    </div>
    
    <!-- 左侧文本框区域 -->
    <div class="textbox-container">
      <!-- 修改v-for循环，显示当前页数据 -->
      <div v-for="(item, index) in currentPageItems" :key="index" 
           class="textbox-item" 
           :style="{
             ...getTextboxStyle(index + 1),
             opacity: showText ? 1 : 0,
             transform: showText ? 'translateX(0)' : 'translateX(20px)',
             transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
           }">
        <div class="textbox" 
             :title="item"
             @click="onTextClick(index)">
          {{ item }}  <!-- 直接显示完整内容，不再截断 -->
        </div>
        <div class="line"></div>
      </div>
    </div>

    <!-- 添加分页按钮 -->
    <!-- 分页控件 -->
    <div class="pagination">
      <button 
        class="prev-btn"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
      />
      <span class="page-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
      <button 
        class="next-btn"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
      />
    </div>
    
    <!-- 添加右侧详情区域 -->
    <div class="right-container">
      <div class="detail-image-container">
        <img src="/map_images/国家政策设计.png" alt="政策背景图" class="detail-image">
      </div>
      <div class="detail-container">
        <div class="detail-content">
          {{ currentDetail }}
        </div>
      </div>
    </div>
    
    <!-- 在合适位置添加路由视图 -->
    <!-- 在template中添加 -->
    <div class="map-view-container">
      <router-view></router-view>
    </div>
    

    
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const textItems = ref([])
const showText = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)

const fetchPolicyData = async (page = 1) => {
  isLoading.value = true
  showText.value = false
  
  try {
    const response = await fetch(`http://localhost:8000/api/policy-content-paginated?page=${page}`)
    const { items, total } = await response.json()
    
    textItems.value = items.map(item => item.content)
    totalPages.value = Math.ceil(total / 9)
    setTimeout(() => showText.value = true, 300)
  } catch (error) {
    console.error('获取政策内容失败:', error)
    textItems.value = ['数据加载失败']
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchPolicyData())

const getTextboxStyle = (i) => {
  // 只保留奇数编号的位置数据
  const positions = [
    { top: 6, left:18.5 },    // 1
    { top: 15, left: 14 },     // 3
    { top: 24, left: 4 },    // 5
    { top: 33, left: 1.5 },      // 7
    { top: 42, left: 1.8 },     // 9
    { top: 51, left: 4 },    // 11
    { top: 60, left: 8},    // 13
    { top: 69, left: 13 },    // 15
    { top: 78, left: 14.5 }    // 17
  ];
  return {
    top: `${positions[i-1].top}vh`,
    left: `${positions[i-1].left}vw`
  };
};



const currentPageItems = computed(() => textItems.value)


const currentDetail = ref('请点击左侧政策查看详情')

const onTextClick = async (index) => {
  try {
    const response = await fetch(`http://localhost:8000/api/policy-content-by-id?id=${index + 1 + (currentPage.value - 1) * 9}`)
    const data = await response.json()
    currentDetail.value = data.body || '暂无详细内容'
    console.log('获取到的内容:', data.body) // 调试用
  } catch (error) {
    console.error('获取详情失败:', error)
    currentDetail.value = '加载详情失败'
  }
}

// 添加网站状态管理


import { useRouter } from 'vue-router'
const router = useRouter()


// 添加翻页功能
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  showText.value = false;
  setTimeout(() => {
    currentPage.value = page;
    setTimeout(() => {
      fetchPolicyData(currentPage.value);
      setTimeout(() => showText.value = true, 300);
    }, 200);
  }, 800);
};
</script>

<style scoped>
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


  /* 这里可以添加具体的样式规则 */
  /* 例如：body { background-color: #f0f0f0; } */
/* 修改导航按钮样式 */




/* 调整标题区域位置 */
.title-area {
  position: absolute;
  top: 4vh;
  left: 8vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}


.title-text {
  font-family: "MyCustomFont";
  font-size: 2vw;

  color: brown; /* 统一为棕色 */
  margin: 0;
  padding-left: 1.5vw;
  margin-bottom: -2vh;
}

/* 标题装饰图标样式 */
.title-decoration {
  width: 15vw;
  height: auto;
  margin-left: -0.5vw;
  margin-top: -2.5vh;

}

/* 牵引点图标样式 */


.textbox-container {
  position: absolute;
  left: 2vw;
  width: 20vw;
  top: 10vh;
}

.textbox-item {
  position: absolute;
  display: flex;
  align-items: flex-end;
  margin-bottom: 2vh;
  will-change: transform, opacity; /* 优化动画性能 */
  transition: 
    opacity 0.2s ease-out,  /* 使用ease-out使动画更平滑 */
    transform 0.2s ease-out;
  will-change: transform, opacity;
}

/* 保留原有的延迟设置 */
.textbox-item:nth-child(1) { transition-delay: 0s; }
.textbox-item:nth-child(2) { transition-delay: 0.1s; }
.textbox-item:nth-child(3) { transition-delay: 0.2s; }
.textbox-item:nth-child(4) { transition-delay: 0.3s; }
.textbox-item:nth-child(5) { transition-delay: 0.4s; }
.textbox-item:nth-child(6) { transition-delay: 0.5s; }
.textbox-item:nth-child(7) { transition-delay: 0.6s; }
.textbox-item:nth-child(8) { transition-delay: 0.7s; }
.textbox-item:nth-child(9) { transition-delay: 0.8s; }
.textbox {
  width: 21vw; /* 从20vw扩大到21vw */
  min-height: 3vh;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1vw;
  margin-right: 0.5vw;
  font-size: 0.9vw;
  font-family: "MyCustomFont";

  white-space: normal;
  word-break: break-all;
  overflow: visible;
  text-overflow: clip;
  text-align: center;
  transition: color 0.1s ease;
}

.textbox:hover {
  color: #ff6b6b; /* 文字高亮颜色 */
 
  cursor: pointer; /* 鼠标指针变化 */
}

.line {
  width: 6vw;
  height: 0.05vh;
  background-color: #000;
  margin-left: 0.5vw;
  margin-bottom: 1.5vh;
  position: relative;
}

.line::after {
  content: '';
  display: block;
  position: absolute;
  right: -1vw;
  top: 50%;
  transform: translateY(-50%);
  width: 0.8vw;
  height: 0.8vw;
  background-image: url('/map_images/国家级非遗政策牵引点.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.pagination {
  position: absolute;
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.page-btn {
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 4px;
}


.right-container {
  position: absolute;
  right: 2vw;
  top: 10vh;
  width: 44vw; /* 从40vw增加到48vw */
  height: 86vh; /* 从80vh增加到86vh */

} 

.detail-image-container {
  position: absolute;
  width: 100%;
  height: 100%;

}

.detail-image {
  width: 44vw;
  height: 100%;
  object-fit: contain; /* 从cover改为contain确保完整显示 */
  border-radius: 8px;
}

.detail-container {
  position: absolute;
  width: 35vw;
  height: 70vh;
  left: 4vw;
  top: 12vh;  
  background: transparent;
  font-family:"MyCustomFont";
  padding: 20px;
  overflow-y: auto;
  /* 新增滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.3) transparent;
}

.detail-container::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}

.detail-container::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.3);
  border-radius: 3px;
}

.detail-container::-webkit-scrollbar-track {
  background-color: transparent;
}

.detail-content {
  font-family:"MyCustomFont";
  font-size: 1vw; /* 从1.2vw减小到1vw */
  line-height: 1.6;
  white-space: pre-wrap;
  color: #333;
}
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}

/* 分页控件样式 */
.pagination {
  position: absolute;
  left: 20vw;  /* 与标题区域对齐 */
  bottom: 2vh;  /* 调整为10vh */
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

.prev-btn, .next-btn {
  width: 30px;
  height: 30px;
  background: url('/public/map_images/翻页按键.png') no-repeat center;
  background-size: contain;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.prev-btn {
  left:-3vw;
  transform: translateY(-50%) rotate(90deg); /* 顺时针旋转90° */
}

.next-btn {
  right: -3vw;
  transform: translateY(-50%) rotate(-90deg); /* 逆时针旋转90° */
}
</style>
