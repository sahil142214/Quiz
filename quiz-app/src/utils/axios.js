import axios from "axios";

// Create an Axios instance with a default base URL
const api = axios.create({
  baseURL: "http://localhost:8000/", // Adjust with your backend API URL
});

// Add a request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is due to token expiration, attempt to refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      try {
        const response = await axios.post("http://localhost:8000/token/refresh/", { refresh: refreshToken });
        const { access } = response.data;

        // Save new access token and retry the original request
        localStorage.setItem("access_token", access);
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Token refresh failed", err);
        // Redirect to login if refresh fails
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
