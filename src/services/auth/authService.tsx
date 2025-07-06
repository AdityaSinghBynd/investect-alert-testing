import axios, { AxiosResponse } from "axios";
import { LoginResponse } from "./auth.interface";
import { BASE_URL } from "@/constant/constant";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/auth/`,
});

export const login = async (payload: Record<string, any>): Promise<boolean> => {
  const { email, password } = payload;
  try {
    const response: AxiosResponse<LoginResponse> = await axiosInstance.post(
      "",
      { email: email, password: password },
    );
    const { token, user_id } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id.toString());
    return true;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

export const changePassword = async (
  payload: Record<string, any>,
): Promise<Record<string, any>> => {
  const { oldPassword, newPassword, userId } = payload;
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      `change-password/${userId}`,
      { old_password: oldPassword, new_password: newPassword },
    );

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    return {
      message: "Internal Server Error",
      status: 401,
    };
  }
};

export const UserUpdate = async (
  payload: Record<string, any>,
): Promise<Record<string, any>> => {
  const { oldPassword, newPassword, userId } = payload;
  try {
    const response: AxiosResponse<any> = await axiosInstance.post(
      `change-password/${userId}`,
      { old_password: oldPassword, new_password: newPassword },
    );

    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    return {
      message: "Internal Server Error",
      status: 401,
    };
  }
};
