import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL:import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)
const secondApi = axios.create({
    baseURL: import.meta.env.VITE_SECOND_API_URL,
    params: {
        apiKey: import.meta.env.VITE_SPOONACULAR_API_KEY
    }
})

export default {api, secondApi};