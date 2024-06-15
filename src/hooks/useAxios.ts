// src/api/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { apiUrlLocal } from "../env";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import useUserStore from "../store/userStore";
import { useIonRouter } from "@ionic/react";

interface iAxiosHook {
  initialConfig?: AxiosRequestConfig;
  accessToken: string;
}

const useAxios = () => {
  const { setUser, access_token } = useUserStore();
  const router = useIonRouter();
  const axiosInstance = axios.create({
    baseURL: apiUrlLocal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const decoded = jwtDecode<JwtPayload>(access_token);
      const { exp } = decoded;
      const token_expiration = new Date(1000 * Number(exp)).toLocaleString();
      const current_time = new Date().toLocaleString();

      if (current_time > token_expiration) {
        const { value } = await Preferences.get({ key: "refreshToken" });

        const options = {
          url: apiUrlLocal + `/refresh/${JSON.parse(value as string)}`,
        };
        const response = await CapacitorHttp.get(options);

        if (response.status >= 401) {
          router.push("/auth", "back", "replace");
          Preferences.remove({ key: "refreshToken" });
          return config;
        }

        setUser(response.data);

        config.headers = {
          ...(config.headers || {}),
          Authorization: `Bearer ${response.data?.access_token ?? ""}`,
        } as AxiosRequestHeaders;
      }
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${access_token}`,
      } as AxiosRequestHeaders;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
