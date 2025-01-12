import axios from "axios";

const userAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/user`,
  withCredentials: true,
});

const UserService = {
  login: (payload) => {
    return userAPI.post("/login", payload);
  },

  googleLogin: () => {
    return userAPI.get("/google");
  },

  githubLogin: () => {
    return userAPI.get("/github");
  },

  register: (payload) => {
    return userAPI.post("/register", payload);
  },

  forgotPassword: (payload) => {
    return userAPI.post("/forgot-password", payload);
  },

  resendVerificationEmail: (userId) => {
    return userAPI.post(`/resend-email-verification/${userId}`);
  },

  verifyEmail: (verificationToken) => {
    return userAPI.get(`/verify-email/${verificationToken}`);
  },

  currentUser: () => {
    return userAPI.get("/current-user");
  },

  logout: () => {
    return userAPI.post("/logout");
  },

  changeAvatar: (payload) => {
    return userAPI.postForm("/avatar", payload);
  },
};

export default UserService;
