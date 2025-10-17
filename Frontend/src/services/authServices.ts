import apiClient from "../utils/apiClient";

export const authService = {
    login: async (data: {email: string, password: string}) => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },

    register: async (data: {fullName: string, userName: string, email: string, password: string}) => {
        const response = await apiClient.post("/auth/signup", data);
      
        return response.data;
    },

    me: async () => {
        const response = await apiClient.get("/auth/me");
        return response.data;
    },
    
    logout: async () => {
        await apiClient.get("/auth/logout");
    }
}