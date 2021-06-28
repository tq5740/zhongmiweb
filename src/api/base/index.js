/* eslint-disable no-undef */
import { Notification } from 'element-ui';
// import axios from 'axios';
import qs from 'qs';
import { isLogin, removeStorage } from '@utils/index';
import router from '../../router';

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.interceptors.request.use((req) => {
	var token = isLogin();
	if (token) {
		req.headers.Authorization = token;
	}
	if (req.method == 'post') {
		if ('params' in req.data && Object.keys(req.data.params).length !== 0) {
			let obj = req.data.params;
			req.data.params = JSON.stringify(obj);
		}
		req.data = qs.stringify(req.data);
	}
	if (req.method === 'get' && req.params) {
		let url = req.url;
		url += '?';
		let keys = Object.keys(req.params);
		for (let key of keys) {
			url += `${key}=${encodeURIComponent(req.params[key])}&`; // 避开axios转码，单独转码
		}
		url = url.substring(0, url.length - 1);
		req.params = {};
		req.url = url;
	}
	return req;
});
var num = 0;
axios.interceptors.response.use(
	(res) => {
		if (res.headers['content-type'] === 'text/html;charset=UTF-8' && num < 1) {
			num += 1;
			login();
		} else if (typeof res.data === 'object' && 'success' in res.data && !res.data.success) {
			if (res.data.statusCode == 401 && num < 1) {
				num += 1;
				login();
			} else if (res.data.msg !== '请先登录') {
				Notification({ type: `error`, title: '提示', message: res.data.msg });
			}
		}
		return res.data;
	},
	(err) => {
		const errObj = JSON.parse(JSON.stringify(err));
		const url = errObj.config.url;
		if ((url.includes("filter/queryFilter") || url.includes("queryDevices") || url.includes("countDiameterByFactory") || errObj.message.includes("401") )) {
			num += 1;
			if (num === 1) {
				login();
			}
		} else {
			Notification({ type: `error`, title: '提示', message: '网络或服务器异常' });
		}
		return Promise.reject(url);
	}
);
function login() {
	Notification({
		type: `error`,
		title: '提示',
		message: '登录已过期，请重新登录',
	});
	removeStorage('token');
	router.push('/login');
}
const productionBase = 'http://221.237.156.192:5710/';
const http = {
	get(url, data) {
		return axios.get(url, { params: data });
	},
	post(url, data) {
		return axios.post(url, data);
	},
	base() {
		return process.env.NODE_ENV === 'production'
			? productionBase + 'client/'
			: 'client/';
		// return '/client';
	},
	base1() {
		return "http://221.237.156.192:5719/api/";
	},
};

export default http;
