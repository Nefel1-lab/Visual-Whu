<template>
  <div ref="chartContainer" style="width: 100%; height: 500px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'PictorialBarChart',
  data() {
    return {
      chart: null,
      chartData: []
    };
  },
  mounted() {
    this.fetchData();
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    window.removeEventListener('resize', this.resizeChart);
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch('/data/非遗项目数据.json');
        if (!response.ok) {
          throw new Error(`无法加载文件: ${response.statusText}`);
        }

        const jsonData = await response.json();
        
        // 处理数据，按类型统计
        const typeMap = new Map();
        jsonData.forEach(item => {
          const type = item.type;
          if (!typeMap.has(type)) {
            typeMap.set(type, 0);
          }
          typeMap.set(type, typeMap.get(type) + 1);
        });
    
        // 转换为图表所需格式
        this.chartData = Array.from(typeMap).map(([type, count]) => ({
          name: type,
          value: count
        }));
      } catch (error) {
        console.error('读取 JSON 文件失败:', error);
      }
    },
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart || !this.chartData.length) return;
    
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: this.chartData.map(item => item.name),
          axisLabel: {
            rotate: 45,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数量',
            type: 'pictorialBar',
            symbol: 'rect',
            symbolSize: [20, 10],
            symbolOffset: [0, -5],
            symbolPosition: 'end',
            data: this.chartData,
            itemStyle: {
              color: '#5470C6'
            }
          }
        ]
      };
    
      this.chart.setOption(option);
    },
    resizeChart() {
      if (this.chart && this.chart.resize) {
        this.chart.resize();
      }
    }
  }
};
</script>

<style scoped>
/* 基本样式 */
</style>