import axios from "axios";
import type { SWRMutationConfiguration } from "swr/mutation";
import useSWRMutation from "swr/mutation";

type MutationConfig<T, E> = SWRMutationConfiguration<T, E> & {
  method?: "get" | "post" | "put" | "delete";
};

export function useMyMutation<T = any, E = any>(url: string, config?: MutationConfig<T, E>) {
  return useSWRMutation<T, E, any, { _param_id?: string; [p: string]: any }>(
    url,
    async (url: string, { arg }: { arg: { _param_id?: string; [p: string]: any } }) => {
      if (arg?._param_id) {
        url += (url.endsWith("/") ? "" : "/") + arg._param_id;
      }
      if (!config?.method || config.method === "post") {
        return (await axios.post<T>(url, arg)).data;
      } else if (config.method === "get") {
        return (
          await axios.get<T>(url, {
            params: arg,
          })
        ).data;
      } else if (config.method === "delete") {
        return (await axios.delete(url, { params: arg })).data;
      } else if (config.method === "put") {
        return (await axios.put(url, arg)).data;
      }
      return Promise.resolve(undefined);
    },
    config,
  );
}
