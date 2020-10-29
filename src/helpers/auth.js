import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import NetInfo from "@react-native-community/netinfo";
import store from "../redux/store";
import { clearAuthentication } from "../redux/ducks/authentication";
import { showNotification } from "./notificationHelper";

export const setToken = async (token) => {
  try {
    setAxiosRequestInterceptor(token);
    await AsyncStorage.setItem("@token", token);
  } catch (e) {}
};

export const getToken = () => AsyncStorage.getItem("@token");

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("@token");
  } catch (e) {}
};

getToken().then((token) => {
  setAxiosRequestInterceptor(token);
});

const checkConnection = async () => {
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    showNotification("error", "notification.offlineError");
  }
};

const setAxiosRequestInterceptor = (token) => {
  axios.interceptors.request.use(
    (config) => {
      const header = { Authorization: `Bearer ${token}` };
      Object.assign(config.headers, header);
      checkConnection();

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    let token = await getToken();
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      token
    ) {
      removeToken()
        .then(() => {
          store.dispatch(clearAuthentication());
        })
        .then(() => {
          showNotification("error", "notification.expiredToken");
        });
    }

    return Promise.reject(error);
  }
);
