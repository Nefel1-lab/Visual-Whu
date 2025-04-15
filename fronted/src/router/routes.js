const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: '/map',
    component: () => import('pages/MapPage1.vue'),
    name: 'Map1',
    meta: { title: '全国非遗政策' }
  },
  {
    path: '/map2',
    component: () => import('pages/MapPage2.vue'),
    name: 'Map2',
    meta: { title: '地方非遗政策' }
  },
  {
    path: '/history',
    component: () => import('pages/DevelopPage.vue'),
    name: 'History',
    meta: { title: '非遗发展' }
  },
];

export default routes;
