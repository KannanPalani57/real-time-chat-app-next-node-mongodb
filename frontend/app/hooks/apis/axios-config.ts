import ax from "axios";

// axios-config.ts
export interface ValidationError {
  code: string;
  maximum?: number;
  type?: string;
  inclusive?: boolean;
  exact?: boolean;
  message: string;
  path: string[];
}

export interface IApiError {
  error: string;
  message?: string; // 👈 add this
  details: ValidationError[];
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_URL + "/apis";
export const axios = ax.create({
  timeout: 60000,
  baseURL: BASE_PATH,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});