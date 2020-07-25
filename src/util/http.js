import axios from 'axios';
import { serverUrl } from './constants';

/**
 * @type {Axios}
 * @type {AxiosInstance}
 */
const instance = axios.create({
    baseURL: serverUrl,
});

export const http = instance;