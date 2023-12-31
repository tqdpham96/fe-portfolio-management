import type { Key, SWRConfiguration } from "swr";
import useSWR from "swr";
import axios from "axios";
import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

type Methods = "get" | "post";

type MySWRConfiguration<T, E> = SWRConfiguration<T, E> & {
  method?: Methods;
  dataOrParams?: any;
};

export default function useMySWR<T = any, E = any>(
  keys: Key,
  methodOrConfig?: Methods | MySWRConfiguration<T, E>,
  dataOrParams?: any,
  config?: SWRConfiguration<T, E>,
) {
  const [latestFetch, setLatestFetch] = useState<Dayjs | undefined>();

  const method = useMemo<string>(() => {
    if (!methodOrConfig || (typeof methodOrConfig === "object" && !methodOrConfig.method)) {
      return "get";
    }

    if (typeof methodOrConfig === "string") {
      return methodOrConfig;
    } else {
      return methodOrConfig.method || "get";
    }
  }, [methodOrConfig]);

  const dataOrParamsRequest = useMemo(
    () => dataOrParams || (typeof methodOrConfig === "object" ? methodOrConfig["dataOrParams"] : undefined),
    [dataOrParams, methodOrConfig],
  );

  const { data, isLoading, mutate, isValidating, error } = useSWR<T, E>(
    keys,
    (args: any) => {
      const url = typeof args === "string" ? args : args[0];
      return (
        method === "get" ? axios.get<T>(url, { params: dataOrParamsRequest }) : axios.post<T>(url, dataOrParamsRequest)
      ).then(res => {
        setLatestFetch(dayjs());
        if (res.data && typeof res.data === "object" && !Array.isArray(res.data)) {
          return {
            ...res.data,
            fetchTime: dayjs().toISOString(),
          };
        }
        return res.data;
      });
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
      ...(config || (typeof methodOrConfig === "object" ? methodOrConfig : undefined)),
    },
  );

  const fetchTime = useMemo(() => {
    if (data && !!(data as any)["fetchTime"] && typeof (data as any)["fetchTime"] === "string") {
      return dayjs((data as any)["fetchTime"]);
    }

    return latestFetch;
  }, [data, latestFetch]);

  return useMemo(
    () => ({
      data,
      isLoading,
      isValidating,
      error,
      mutate,
      fetchTime,
    }),
    [data, error, fetchTime, isLoading, isValidating, mutate],
  );
}
