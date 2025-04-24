<template>
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  data: { type: Array, required: true }
});

const chartContainer = ref(null);
let chart = null;

const initChart = () => {
  if (!chartContainer.value || !chartContainer.value.offsetParent) {
    console.error('TypePictorialBar: Container not found or not visible');
    return;
  }
  try {
    chart = echarts.init(chartContainer.value);
    console.log('TypePictorialBar: Initialized');
    updateChart();
    window.addEventListener('resize', resizeChart);
  } catch (error) {
    console.error('TypePictorialBar: Init failed', error);
  }
};

const updateChart = () => {
  if (!chart) return;
  if (!props.data || props.data.length === 0) {
    console.warn('TypePictorialBar: No data');
    return;
  }

  const provinceMap = new Map();
  props.data.forEach(item => {
    const province = item.province;
    if (!provinceMap.has(province)) {
      provinceMap.set(province, { count: 0, types: {} });
    }
    const provinceData = provinceMap.get(province);
    provinceData.count++;
    const type = item.type;
    if (!provinceData.types[type]) {
      provinceData.types[type] = 0;
    }
    provinceData.types[type]++;
  });

  const chartData = Array.from(provinceMap).map(([province, data]) => ({
    province,
    count: data.count,
    types: data.types
  }));

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const province = params.name;
        const types = chartData.find(item => item.province === province)?.types || {};
        const typeDetails = Object.entries(types).map(([type, count]) => `${type}: ${count}`).join('<br>');
        return `${province}<br>${typeDetails}`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: '#000',
        fontSize: 12
      },
      position: 'left'
    },
    grid: {
      top: '0%',
      left: '10%',
      right: '5%',
      bottom: '30%'
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.province),
      axisTick: { show: true },
      axisLine: { show: true },
      axisLabel: {
        color: '#000',
        rotate: 45,
        fontSize: 12,
        interval: 0,
        width: 1000
      },
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      splitLine: { show: true },
      axisTick: { show: true },
      axisLine: { show: false },
      axisLabel: { show: true }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        start: 0,
        end: 50, // 初始显示 50% 的数据
        bottom: '20%', // 滚动条位置
        height: 10, // 滚动条高度
        resize: false, // 禁止拖动条改变大小
        zoomLock: true // 新增：禁止缩放
      }
    ],
    series: [
      {
        name: 'hill',
        type: 'pictorialBar',
        barCategoryGap: '-80%',
        barWidth: '120%',
        color: '#7d6955',
        symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
        itemStyle: {
          opacity: 0.5,
          transition: 'opacity 0.7s ease'
        },
        emphasis: {
          itemStyle: {
            color: 'brown',
            opacity: 1
          }
        },
        data: chartData.map(item => item.count),
        z: 10,
        animationDuration: 700,
        animationEasing: 'cubicInOut',
        label: { // 新增：显示 Y 轴的 value
          show: true,
          position: 'top',
          fontFamily: 'MyCustomFont',
          formatter: '{c}', // 显示数据值
          color: '#000', // 文字颜色
          fontSize: 12 // 文字大小
        }
      }
    ]
  };

  try {
    chart.setOption(option);
  } catch (error) {
    console.error('TypePictorialBar: Update failed', error);
  }
};

const resizeChart = () => {
  if (chart) chart.resize();
};

watch(() => props.data, updateChart, { deep: true });

onMounted(async () => {
  await nextTick();
  initChart();
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    window.removeEventListener('resize', resizeChart);
  }
});
</script>

<style scoped>
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}

</style>
