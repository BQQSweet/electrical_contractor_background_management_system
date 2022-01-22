import axios from "axios";
import { Message } from "element-ui";
import { getToken } from "../utils/auth";
const http = axios.create({
  baseURL: "http://47.242.254.89/api/private/v1/",
  timeout: 1000,
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token
    }
    console.log("请求拦截器", config);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  function (response) {
    const { data } = response;
    if (data.meta.status != 200) {
      Message.error(data.meta.msg);
      return [data.meta, null];
    }
    Message.success(data.meta.msg);
    return [null, data.data];
  },
  function (error) {
    Message.error(error);
    return Promise.reject(error);
  }
);
export default http;
