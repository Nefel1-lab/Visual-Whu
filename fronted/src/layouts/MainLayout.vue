<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="nav-toolbar">
        <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title class="title-text">非遗文化展示</q-toolbar-title>
        <q-btn flat label="首页" to="/" />
        <q-btn-dropdown flat label="非遗政策" stretch>
          <q-list>
            <q-item clickable v-close-popup to="/map/policy">
              <q-item-section>国家政策</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/map/local">
              <q-item-section>地方政策</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat label="非遗发展" to="/history" />
        <q-btn flat label="数据分析" to="/data" />
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered  
      :width="200" 
      :breakpoint="700"
      class="drawer-transition" 
    >
      <q-list>
        <q-item-label header>导航</q-item-label>
        <q-item clickable to="/">
          <q-item-section>首页</q-item-section>
        </q-item>
        <q-expansion-item label="非遗政策">
          <q-item clickable to="/map/policy">
            <q-item-section>国家政策</q-item-section>
          </q-item>
          <q-item clickable to="/map/local">
            <q-item-section>地方政策</q-item-section>
          </q-item>
        </q-expansion-item>
        <q-item clickable to="/history">
          <q-item-section>非遗发展</q-item-section>
        </q-item>
        <q-item clickable to="/data">
          <q-item-section>数据分析</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
/* 添加过渡效果 */
.drawer-transition {
  transition: all 0.3s ease;
}

/* 调整导航栏样式 */
.q-drawer {
  width: 200px !important;  /* 设置固定宽度 */
  min-width: 200px;  /* 防止内容挤压 */
}

/* 保持原有样式不变 */
.nav-toolbar {
  background: linear-gradient(135deg, #edd3a1, #b69860);
  width: 100%;
  gap: 40px;
}

.title-text {
  font-family: "SimSun", serif;
  font-weight: bold;

  color: #8b0000d5; /* 深红色 */
}
</style>
