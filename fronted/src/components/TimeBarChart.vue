<template>
  <div ref="chartContainer" style="width: 80%; height: 400px;left:10vw"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TimeBarChart',
  props: {
    timeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    timeData: {
      handler: 'updateChart',
      deep: true
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      if (!this.$refs.chartContainer) return;
      this.chart = echarts.init(this.$refs.chartContainer);
      this.updateChart();
    },
    updateChart() {
      if (!this.chart || !this.timeData) return;

      // 定义顺序
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

      // 定义颜色数组，与 order 顺序对应
      const colors = {
        '民间文学': '#FFEFD5',
        '传统音乐': '#e9e2cf',
        '传统舞蹈': '#d3cdb9',
        '传统戏剧': '#cbbcaa',
        '曲艺': '#e2d9b1',
        '传统体育、\n游艺与杂技': '#ddcba2',
        '传统美术': '#b09f6c',
        '传统技艺': '#c1a276',
        '传统医药': '#b77c50',
        '民俗': '#8c765f'
      };

      // 按照顺序过滤和排序数据
      const types = order.filter(type => this.timeData[type] !== undefined);
      const counts = types.map(type => this.timeData[type]);

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            return params[0].name + ': ' + params[0].value;
          },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#ccc',
          borderWidth: 1,
          textStyle: {
            color: '#000',
            fontSize: 12
          },
          padding: [5, 10]
        },
        grid: {
          left: '20%',
          right: '20%',
          top: '20%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 12
          }
        },
        yAxis: {
          type: 'category',
          data: types,
          axisLabel: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: counts,
            itemStyle: {
              color: (params) => colors[types[params.dataIndex]] // 使用与 type 对应的颜色
            },
            label: {
              show: true,
              position: 'right',
              formatter: '{c}',
              fontSize: 12,
              color: '#000'
            }
          }
        ],
        graphic: [ // 新增：在图表左方显示 time 属性
          {
            type: 'text',
            left: '5%',
            top: '17%',
            
            style: {
              text: ` ${this.timeData.time || '未知'}`, // 添加默认值处理
              fill: '#000',
              fontSize: 20,
              colors: '#000',
              fontFamily: 'MyCustomFont',
            }
          }
        ]
      };

      this.chart.setOption(option);
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>
<style>
@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}
</style>