import { auth } from "@clerk/nextjs/server";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

// API Client with Clerk JWT integration
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Attach Clerk JWT token to requests
  private async getAuthHeaders() {
    const { getToken } = await auth();
    const token = await getToken();

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await this.client.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...authHeaders,
      },
    });
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await this.client.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...authHeaders,
      },
    });
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await this.client.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...authHeaders,
      },
    });
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const authHeaders = await this.getAuthHeaders();
    const response = await this.client.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...authHeaders,
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
