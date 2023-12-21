import { message } from 'antd';
import axios from 'axios';

export declare let ENV_BASE_URL: string;
export declare let REQUEST_TIME_OUT: number;

const MESSAGE_DURATION = 3;

let envBaseUrl: string;
try {
  envBaseUrl = ENV_BASE_URL;
} catch {
  envBaseUrl = '';
}

let requestTimeOut: number;
try {
  requestTimeOut = REQUEST_TIME_OUT;
} catch {
  requestTimeOut = 10000;
}

export function getAxiosInstance() {
  return axios.create({
    baseURL: envBaseUrl || '',
    timeout: requestTimeOut, // request timeout
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=utf-8',
    },
  });
}

const axiosRequest = getAxiosInstance();

axiosRequest.interceptors.request.use(
  (requestConfig: any) => {
    // eslint-disable-next-line no-param-reassign
    requestConfig.headers['Access-Control-Allow-Origin'] = '*';
    // eslint-disable-next-line no-param-reassign
    requestConfig.headers['Access-Control-Allow-Origin'] = 'X-Requested-With';
    // requestConfig.headers['Content-Type'] = 'application/json';
    console.log('axios default request interceptors...', requestConfig);
    return requestConfig;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

axiosRequest.interceptors.response.use(
  (response) => {
    console.log('axios default response interceptors...');
    const res = response.data;
    if (res.resultCode === '200' || res.code === 0 || res.code === 200) {
      return res;
    } else {
      message.error(res.message || 'Error', MESSAGE_DURATION);
      return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  (error) => {
    message.error(error.message || 'Error', MESSAGE_DURATION);
    return Promise.reject(error);
  },
);

export default axiosRequest;
