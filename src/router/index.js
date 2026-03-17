import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/methode/1',
      name: 'methode1',
      component: () => import('@/views/Methode1View.vue'),
    },
    {
      path: '/methode/2',
      name: 'methode2',
      component: () => import('@/views/Methode2View.vue'),
    },
    {
      path: '/methode/3',
      name: 'methode3',
      component: () => import('@/views/Methode3View.vue'),
    },
    {
      path: '/ergebnis',
      name: 'ergebnis',
      component: () => import('@/views/ErgebnisView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
