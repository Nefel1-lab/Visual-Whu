<template>
  <q-page class="q-pa-md policy-page">
    <h2 class="q-mb-md text-center">非遗数据分析</h2>

    <!-- 筛选和分析控制区 -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-select
          v-model="chartType"
          :options="chartOptions"
          label="选择图表类型"
          outlined
          dense
          class="q-mb-sm"
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-select
          v-model="dataCategory"
          :options="dataCategoryOptions"
          label="选择数据分类"
          outlined
          dense
          class="q-mb-sm"
          
        />
      </div>
      <div class="col-12 col-sm-4">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          label="搜索"
          clearable
          class="q-mb-sm"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- 修改为左右布局 -->
    <div class="row q-col-gutter-md">
      <!-- 左侧图表区域 -->
      <div class="col-12 col-md-6">
        <div class="chart-container q-mb-md">
          <q-spinner v-if="loading" color="primary" size="3em" />
          <div v-else-if="chartError" class="text-negative">{{ chartError }}</div>
          <div v-else style="width: 100%; height: 400px;">
            <bar-chart v-if="chartType === '柱状图'" :chart-data="filteredChartData" />
            <pie-chart v-else-if="chartType === '饼图'" :chart-data="filteredChartData" />
            <line-chart v-else-if="chartType === '折线图'" :chart-data="filteredChartData" />
          </div>
        </div>
      </div>

      <!-- 右侧数据表格区域 -->
      <div class="col-12 col-md-6">
        <div class="table-container">
          <q-table
            :rows="filteredData"
            :columns="columns"
            row-key="id"
            :pagination="pagination"
            :loading="loading"
            :filter="searchQuery"
            binary-state-sort
            flat
            bordered
          >
            <template v-slot:top>
              <div class="text-h6">非遗数据列表</div>
              <q-space />
              <q-btn
                color="primary"
                icon="file_download"
                label="导出数据"
                @click="exportTable"
                flat
              />
            </template>
          </q-table>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// 移除 Excel 相关导入
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/PieChart.vue';
import LineChart from '../components/LineChart.vue';

const $q = useQuasar();
const loading = ref(false);
const chartError = ref('');
const chartType = ref('柱状图');
const chartOptions = ['柱状图', '饼图', '折线图'];
const dataCategory = ref('批次');
const dataCategoryOptions = ['批次', '地区', '年份', '类型'];
const searchQuery = ref('');
const pagination = ref({ rowsPerPage: 10 });

// 表格列定义
const columns = [
  { name: 'name', align: 'left', label: '名称', field: 'name', sortable: true },
  { name: 'type', align: 'left', label: '类型', field: 'type', sortable: true },
  { name: 'region', align: 'left', label: '申报地区或单位', field: 'region', sortable: true },
  { name: 'protector', align: 'left', label: '保护单位', field: 'protector', sortable: true },
  { name: 'content', align: 'left', label: '内容', field: 'content' },
  { name: 'year', align: 'left', label: '时间', field: 'year', sortable: true },
  { name: 'batch', align: 'left', label: '批次', field: 'batch', sortable: true }
];

// 数据存储
const heritageData = ref([]);

// 读取 JSON 文件
const readJsonFile = async () => {
  try {
    loading.value = true;
    chartError.value = '';

    const response = await fetch('/data/非遗项目数据.json');
    if (!response.ok) {
      throw new Error(`无法加载文件: ${response.statusText}`);
    }

    const jsonData = await response.json();
    console.log('JSON 数据:', jsonData);

    // 处理 JSON 数据
    const processedData = jsonData.map(item => ({
      id: item.id,
      name: item.project,
      type: item.type,
      region: item.place,
      province: item.province,
      protector: item.protecter,
      batch: item.time
    }));

    heritageData.value = processedData;
    console.log('处理后的数据:', heritageData.value);

    if ($q.notify) {
      $q.notify({
        message: `成功导入 ${heritageData.value.length} 条数据`,
        color: 'positive',
        icon: 'check_circle'
      });
    } else {
      console.warn('Quasar Notify 未启用');
    }
  } catch (error) {
    console.error('处理 JSON 文件失败:', error);
    chartError.value = '加载数据失败，请检查文件格式或路径';
    if ($q.notify) {
      $q.notify({
        message: '处理数据失败，请检查文件格式或路径',
        color: 'negative',
        icon: 'error'
      });
    } else {
      console.warn('Quasar Notify 未启用');
    }
  } finally {
    loading.value = false;
  }
};

// 组件挂载时读取文件
onMounted(async () => {
  await readJsonFile();
});

// 处理图表数据
const processChartData = computed(() => {
  const data = {};

  if (!heritageData.value) return [{ name: '暂无数据', value: 0 }]; // 添加空值检查

  if (dataCategory.value === '类型') {
    heritageData.value.forEach(item => {
      const key = item.type || '未知类型';
      if (!data[key]) data[key] = 0;
      data[key]++;
    });
  } else if (dataCategory.value === '地区') {
    heritageData.value.forEach(item => {
      const key = item.province || '未知地区';
      if (!data[key]) data[key] = 0;
      data[key]++;
    });
  } else if (dataCategory.value === '年份') {
    heritageData.value.forEach(item => {
      const key = item.year || '未知年份';
      if (!data[key]) data[key] = 0;
      data[key]++;
    });
  } else if (dataCategory.value === '批次') {
    heritageData.value.forEach(item => {
      const key = item.batch || '未知批次';
      if (!data[key]) data[key] = 0;
      data[key]++;
    });
  }

  const result = Object.entries(data).map(([name, value]) => ({ name, value }));
  console.log('Processed chart data:', result);
  return result.length > 0 ? result : [{ name: '暂无数据', value: 0 }];
});

// 过滤图表数据
const filteredChartData = computed(() => {
  if (!heritageData.value) return [{ name: '暂无数据', value: 0 }]; // 添加空值检查

  if (!searchQuery.value) {
    return processChartData.value;
  }

  const query = searchQuery.value.toLowerCase();
  let filteredData;

  if (dataCategory.value === '类型') {
    filteredData = heritageData.value.filter(item =>
      (item.type || '').toLowerCase().includes(query)
    );
  } else if (dataCategory.value === '地区') {
    filteredData = heritageData.value.filter(item =>
      (item.region || '').toLowerCase().includes(query) ||
      (item.province || '').toLowerCase().includes(query)
    );
  } else if (dataCategory.value === '年份') {
    filteredData = heritageData.value.filter(item =>
      (item.year || '').toLowerCase().includes(query)
    );
  } else if (dataCategory.value === '批次') {
    filteredData = heritageData.value.filter(item =>
      (item.batch || '').toLowerCase().includes(query)
    );
  } else {
    filteredData = heritageData.value;
  }

  const data = {};
  let categoryField;

  if (dataCategory.value === '类型') {
    categoryField = 'type';
  } else if (dataCategory.value === '地区') {
    categoryField = 'province';
  } else if (dataCategory.value === '年份') {
    categoryField = 'year';
  } else if (dataCategory.value === '批次') {
    categoryField = 'batch';
  }

  filteredData.forEach(item => {
    const category = item[categoryField] || `未知${dataCategory.value}`;
    if (!data[category]) data[category] = 0;
    data[category]++;
  });

  const result = Object.entries(data).map(([name, value]) => ({ name, value }));
  console.log('Filtered chart data:', result);
  return result.length > 0 ? result : [{ name: '暂无数据', value: 0 }];
});

// 过滤表格数据
const filteredData = computed(() => {
  if (!heritageData.value) return []; // 添加空值检查

  if (!searchQuery.value) {
    return heritageData.value;
  }

  const query = searchQuery.value.toLowerCase();
  return heritageData.value.filter(item =>
    (item.name || '').toLowerCase().includes(query) ||
    (item.type || '').toLowerCase().includes(query) ||
    (item.region || '').toLowerCase().includes(query) ||
    (item.province || '').toLowerCase().includes(query) ||
    (item.content || '').toLowerCase().includes(query) ||
    (item.year || '').toLowerCase().includes(query) ||
    (item.batch || '').toLowerCase().includes(query)
  );
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
  background: #ffffff00;
  border-radius: 8px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.chart-container > div {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-container canvas {
  max-width: 100%;
  max-height: 100%;
}
.table-container {
  width: 100%;
  background: #ffffff00;
  border-radius: 8px;

  margin-top: 20px;
}

h2 {
  color: #ff6b6b;
  font-weight: 500;
}

/* 添加页面整体右移样式 */
.policy-page {
  width: 100vw;
  height: 100vh;
  background-image: url('/map_images/总背景底图.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.policy-page > * {
  transform: translateX(2vw); /* 仅移动内容 */
}

h2 {
  font-family: "MyCustomFont";
  font-size: 32px;
  color: brown;
  text-align: center;
  margin-bottom: 20px;
}


.table-container {
  background-color: rgba(255, 255, 255, 0);
  border-radius: 8px;
  padding: 20px;

}



.q-select, 
.q-input,
.q-btn {
  font-family: "MyCustomFont";
}

.q-btn {
  font-size: 14px;
}

.text-h6 {
  font-family: "MyCustomFont";
  color: rgb(118, 69, 5);
}

@font-face {
  font-family: 'MyCustomFont';
  src: url('/fonts/FZ1.ttf') format('truetype');
}

.q-select, .q-input {
  font-family: "MyCustomFont";
}

.q-btn {
  font-family: "MyCustomFont";
  font-size: 14px;
}

/* 调整布局样式 */
.row.q-col-gutter-md {
  display: flex;
  flex-wrap: wrap;
}

.col-md-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

/* 调整图表和表格容器高度 */
.chart-container,
.table-container {
  height: calc(100vh - 200px); /* 根据实际需要调整高度 */
  overflow: auto;
}

/* 响应式调整 - 小屏幕时堆叠显示 */
@media (max-width: 768px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
