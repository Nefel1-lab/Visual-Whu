<template>
  <div class="chart-page">
    <h2 class="q-mb-md text-center">非遗项目批次统计</h2>
    <div class="chart-container">
      <BarChart />
    </div>
    <!-- 新增容器 -->
    <div class="chart-container">
      <PictorialBarChart />
    </div>
  </div>
</template>

<script setup>
import BarChart from '../components/BarChart.vue';
import PictorialBarChart from '../components/PictorialBarChart.vue'; // 新增导入
</script>

<style scoped>
.chart-page {
  width: 100%;
  height: 100%;
  padding: 20px;
  transform: translateY(10vh); /* 下移容器 */
}

.chart-container {
  width: 50vw;
  height: 60vh; /* 放大容器高度 */
  margin-top: 10vh;
  margin-bottom: 10vh; /* 新增：增加底部间距 */
}
</style>