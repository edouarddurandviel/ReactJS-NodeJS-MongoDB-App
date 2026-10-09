import axios from "axios";
import type { PathParamsObject, QueryObject } from "./interfaces";
import { urlBuilder } from "./buildUrl";
import { default as apiCache } from "./createApiCache";
import config from "../config";

export default async (props: {
  path: string;
  method: string;
  params?: PathParamsObject;
  data?: any;
  query?: QueryObject;
}) => {
  const cache = await apiCache.getInstance();

  const apiClient = await axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(async (config) => {
    const key = config.url;
    const isCacheEnabled = await cache.manageRequest(key, config);
    const cachedData = cache.getCache(key)
    if (isCacheEnabled) {
      return Promise.reject({
        __fromCache: true,
        data: cachedData,
      });
    } else {
      return config;
    }
  });

  apiClient.interceptors.response.use(async (response) => {
    const resp = await cache.manageResponse(response);
    return resp;
  });

  try {
    const resp = await apiClient.request({
      url: await urlBuilder(props.path, props.params, props.query),
      method: props.method,
      ...(props.data && { data: props.data }),
      validateStatus(status) {
        return status === 200;
      },
    });
    return resp;
  } catch (err: any) {
    if (err.__fromCache) {
      return err;
    }
  }
};
