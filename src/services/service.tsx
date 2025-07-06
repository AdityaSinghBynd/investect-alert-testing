import axios, {
  AxiosInstance,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getSession } from "next-auth/react";
import { BASE_URL } from "@/constant/constant";

export class ApiService {
  private static axiosInstance: AxiosInstance;

  public static initialize() {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create({
        baseURL: `${BASE_URL}`,
        timeout: 300000,
      });
    }
  }

  public static async getToken(): Promise<string | null> {
    try {
      const session = await getSession();
      return session?.accessToken ?? null;
    } catch (error) {
      console.error("Failed to retrieve session:", error);
      return null;
    }
  }

  public static async apiCall(
    method: string,
    url: string,
    data: any = null,
    token: string | null = null,
    headers: Record<string, string> = {},
    useAuth: boolean = true,
    config: Partial<AxiosRequestConfig> = {},
  ): Promise<AxiosResponse<any>> {
    this.initialize();

    try {
      if (useAuth) {
        if (!token) {
          token = await this.getToken();
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const requestConfig: AxiosRequestConfig = {
        method,
        url,
        headers: {
          ...headers,
        },
        ...config,
      };

      if (method.toLowerCase() === "get" || method.toLowerCase() === "delete") {
        requestConfig.params = data;
      } else {
        requestConfig.data = data;
      }

      const response = await this.axiosInstance(requestConfig);
      return response;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  }
}

export default ApiService;
