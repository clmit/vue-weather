import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Главная страница'
      }
    },
    {
      path: '/weather/:country/:city',
      name: 'cityView',
      component: CityView,
      meta: {
        title: 'Погода'
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = `${to.params.city ? `${to.params.city}` : to.meta.title} | Че там с погодой`;
  next();
})

export default router
