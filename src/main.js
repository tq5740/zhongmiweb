import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import api from '../src/api/base/index';
import all from '../src/api/modules/all';
import '@style/reset.css';
import {
	Input,
	Form,
	FormItem,
	Button,
	Select,
	Option,
	Dialog,
	Loading,
	Table,
	TableColumn,
	Checkbox,
	Carousel,
	CarouselItem,
	Image,
	Pagination,
	Switch,
	Notification,
	MessageBox,
	DatePicker,
	Popover,
	Tooltip,
	// RadioGroup,
	// RadioButton,
} from 'element-ui';
const elemArr = [
	Input,
	Form,
	FormItem,
	Button,
	Select,
	Option,
	Dialog,
	Table,
	TableColumn,
	Checkbox,
	Carousel,
	CarouselItem,
	Image,
	Pagination,
	Switch,
	DatePicker,
	Popover,
	Tooltip,
	// RadioGroup,
	// RadioButton,
];
import 'element-ui/lib/theme-chalk/index.css';
import { setStorage, getStorage, removeStorage } from '@utils/index';
Vue.use(Loading.directive);
elemArr.forEach((item) => {
	Vue.use(item);
});

Vue.config.productionTip = false;

Vue.prototype.$axios = api;
Vue.prototype.$api = all;

Vue.prototype.$Notif = Notification;
Vue.prototype.$Loading = Loading.service;
Vue.prototype.$MessageBox = MessageBox;

Vue.prototype.$SetStorage = setStorage; // 设置缓存
Vue.prototype.$GetStorage = getStorage; // 获取缓存
Vue.prototype.$RemoveStorage = removeStorage; // 清除缓存

new Vue({
	render: (h) => h(App),
	router,
	store,
}).$mount('#app');
