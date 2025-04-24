<template>
  <div ref="chartContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [] // 默认值为空数组
    }
  },
  data() {
    return {
      chart: null,
      chartData: [],
      is_shrink: 0
    };
  },
  watch: {
    data: {
      handler: 'processData',
      deep: true,
      immediate: true // 立即执行
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  methods: {
    processData() {
      // 确保 this.data 是一个数组
      if (!Array.isArray(this.data)) {
        console.error('数据格式错误：this.data 不是一个数组');
        return;
      }

      // 处理数据，按批次和类型统计
      const batchMap = new Map();
      this.data.forEach(item => {
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
    
      // 转换为图表所需格式，并按批次顺序排列
      const batchOrder = ['第一批', '第二批', '第三批', '第四批', '第五批'];
      this.chartData = batchOrder.map(batch => ({
        name: batch,
        types: batchMap.get(batch) || {}
      }));
    
      this.updateChart();
    },
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.processData();
  
      // 添加点击事件
      this.chart.on('click', (params) => {
        const timeIndex = params.dataIndex;
        const timeData = {
          ...this.chartData[timeIndex].types, // 保留原有的 types 数据
          time: this.chartData[timeIndex].name // 新增：添加 time 属性
        };
        this.$emit('time-selected', timeData); // 将选中的 time 数据传递给父组件
        this.$emit('shrink-chart'); // 触发缩小事件
      });
    },
    adjustChartSize() {
      const container = this.chart.getDom();
      if (this.is_shrink === 0) {
        container.style.transform = 'scale(1)';
      } else if (this.is_shrink === 1) {
        container.style.transform = 'scale(0.8)';
      }
      container.style.transformOrigin = 'center center';
      container.style.transition = 'transform 0.3s ease';
    },
    updateChart() {
      if (!this.chart || !this.chartData.length) return;
    
      // 定义叠图顺序
      const order = [
        '民间文学',
        '传统音乐',
        '传统舞蹈',
        '传统戏剧',
        '曲艺',
        '传统体育、\n游艺与杂技',
        '传统美术',
        '传统技艺',
        '传统医药',
        '民俗'
      ];
    
      // 定义颜色数组
      const colors = ['#FFEFD5','#e9e2cf','#d3cdb9','#cbbcaa','#e2d9b1', '#ddcba2', '#b09f6c', '#c1a276', '#b77c50', '#8c765f'];
    
      const option = {
        tooltip: {},
        angleAxis: {
          type: 'category',
          data: this.chartData.map(item => item.name),
          startAngle: 160,
          show: false,
          endAngle: 20,
          axisLabel: {
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: '#fff',
              show: false,
              width: 2
            }
          }
        },
        radiusAxis: {
          min: 0,
          splitLine: {
            lineStyle: {
              color: '#923423',
              opacity: 0.3,
              type: 'dashed',
              show: false,
              width: 2
            }
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: ['20%', '90%'],
          splitArea: {
            areaStyle: {
              color: '#e2dec6'
            }
          }
        },
        series: order.map((type, index) => ({
          name: type,
          type: 'bar',
          coordinateSystem: 'polar',
          stack: 'total',
          barWidth: 20,
          barGap: '30%',
          data: this.chartData.map(item => item.types[type] || 0), // 没有数据的 type 显示为 0
          itemStyle: {
            color: colors[index % colors.length] // 颜色与 type 对应
          },
          emphasis: {
            focus: 'series',
            blurScope: 'coordinateSystem',
            itemStyle: {
              opacity: 1
            },
            blur: {
              itemStyle: {
                opacity: 0.2
              }
            }
          },
          label: {
            show: index === 9, // 仅在最外层显示标签
            position: 'outside',
            distance: 5, // 调整标签与数据区域的距离
            formatter: (params) => {
              const total = this.chartData[params.dataIndex].types[type] || 0;
              return `${this.chartData[params.dataIndex].name}`;
            },
            fontSize: 12,
            color: '#000'
          }
        }))
      };
    
      // 添加高亮效果
      this.chart.on('mouseover', (params) => {
        const timeIndex = params.dataIndex;
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: order.map((_, i) => i),
          dataIndex: timeIndex
        });
      });
    
      this.chart.on('mouseout', () => {
        this.chart.dispatchAction({
          type: 'downplay'
        });
      });
    
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
