import axios from 'axios';
import {useAuth} from "../context/AuthContext";

const useAxios = () => {
    let { authToken, removeAuthToken } = useAuth();

    const instance = axios.create({
        baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
    });

    instance.interceptors.request.use((config) => {
        if (!authToken) {
            authToken = 'none';
        }
        config.headers.Authorization = `Bearer ${authToken}`;
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                removeAuthToken();
                return;
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;
