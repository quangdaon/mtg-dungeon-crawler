import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

export const HomeRoute = Symbol('Home');
export const DungeonRoute = Symbol('Dungeon');

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: HomeRoute,
		component: Home
	},
	{
		path: '/dungeon/:slug',
		name: DungeonRoute,
		component: () => import('../views/Dungeon.vue')
	}
];

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
});

export default router;
