import { ApiResponse } from "@/interfaces/api.interface";
import axios from "axios";

export async function apiGet<K=unknown>(endpoint: string){
    const axiosResponse = await axios.get<ApiResponse<K>>(`${process.env.NEXT_PUBLIC_CHAT_APP_CLIENT_URL}/${endpoint}`)
    return axiosResponse.data 
}

export async function apiPost<T,K=unknown>(endpoint: string, data: T) {
    const axiosResponse = await axios.post<ApiResponse<K>>(`${process.env.NEXT_PUBLIC_CHAT_APP_CLIENT_URL}/${endpoint}`, data);
    return axiosResponse.data;
}