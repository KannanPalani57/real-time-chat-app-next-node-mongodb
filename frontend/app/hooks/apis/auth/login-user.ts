import { MutateOptions, useMutation } from "@tanstack/react-query";

import { axios, IApiError } from "../axios-config";

export type UserResults = {
  success: boolean;
  accessToken: string
};

export type UserParams = {
  email: string;
  password: string;
};

async function user(params: UserParams) {
  const res = await axios.post<UserResults>(
    "/login",
    {
      email: params.email,
      password: params.password,
    }
    // {
    //   headers: {
    //     Authorization: "Bearer " + params.accessToken,
    //   },
    // }
  );
  return res.data;
}

export const useLoginUser = (
  config?: MutateOptions<UserResults, IApiError, UserParams>
) => {
  return useMutation({
    mutationFn: (params: UserParams) => user(params),
    ...config,
    retry: false,
  });
};
