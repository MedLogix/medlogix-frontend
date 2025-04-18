import apiClient from "@/lib/axios";

const AuthService = {
  login: (payload) => {
    return apiClient.post("/api/v1/auth/login", payload);
  },
  register: (payload) => {
    return apiClient.post("/api/v1/auth/register", payload);
  },
  getCurrentUser: () => {
    return apiClient.get("/api/v1/auth/me");
  },
};

export default AuthService;
