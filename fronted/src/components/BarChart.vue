<template>
  <div ref="chartContainer" style="width: 100%; height: 500px;left:65vw;top:20vh"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
  data() {
    return {
      chart: null,
      chartData: []
    };
  },
  watch: {
    chartData: {
      handler: 'updateChart',
      deep: true
    }
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
        
        // 处理数据，按批次和类型统计
        const batchMap = new Map();
        jsonData.forEach(item => {
          const batch = item.time;
          const type = item.type;
          
          if (!batchMap.has(batch)) {
            batchMap.set(batch, {});
          }
          
          const batchData = batchMap.get(batch);
          
          if (!batchData[type]) {
            batchData[type] = 0;
          }
          
          batchData[type]++;
        });
    
        // 转换为图表所需格式
        this.chartData = Array.from(batchMap).map(([batch, types]) => ({
          name: batch,
          types
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
    
      // 获取所有类型
      const types = new Set();
      this.chartData.forEach(item => {
        Object.keys(item.types).forEach(type => types.add(type));
      });
    
      const option = {
        tooltip: {

        },
        angleAxis: {
          type: 'category',
          data: ['第一批', '第二批', '第三批', '第四批', '第五批'], // 修改：按批次顺序排列
          startAngle: 160,
          show: false,
          endAngle: 20,
          axisLabel: {
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: '#ddd',
              width: 2
            }
          },

        },
        radiusAxis: {
          min: 0,
          max: Math.max(...this.chartData.map(item => Object.values(item.types).reduce((a, b) => a + b, 0))),
        },
        polar: {
          center: ['50%', '50%'],
          radius: ['20%', '90%'],
          splitArea: {
          }
        },
        series: Array.from(types).map(type => ({
          name: type,
          type: 'bar',
          coordinateSystem: 'polar',
          stack: 'total',
          barWidth: 20,
          barGap: '30%',
          data: this.chartData.map(item => item.types[type] || 0),
          emphasis: { // 添加悬浮效果
            focus: 'self',
            blurScope: 'coordinateSystem',

          }
        }))
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
