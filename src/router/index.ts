import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
// import component from '../views/throttle-page/Throttle.vue'
import Throttle from '@/views/throttle-page/Throttle.vue'
import Locomotives from '@/views/locomotives-page/locomotives.vue'
import Functions from '@/views/functions-page/functions.vue'
import Settings from '@/views/settings-page/settings.vue'

import SettingsGeneral from '@/views/settings-page/pages/general.vue'
import SettingsStorage from '@/views/settings-page/pages/storage.vue'
import SettingsApp from '@/views/settings-page/pages/app.vue'
import SettingsAbout from '@/views/settings-page/pages/about.vue'
// import component from '@/views/throttle-page/Throttle.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Throttle 
    },
    {
        path: '/locomotives',
        name: 'Locomotives',
        component: Locomotives
    },
    {
        path: '/functions',
        name: 'Functions',
        component: Functions
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
        children: [
            {
                path: '',
                component: SettingsGeneral
            },
            {
                path: 'storage',
                component: SettingsStorage
            },
            {
                path: 'app',
                component: SettingsApp
            },
            {
                path: 'about',
                name: "About",
                component: SettingsAbout
            },
        ],
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
