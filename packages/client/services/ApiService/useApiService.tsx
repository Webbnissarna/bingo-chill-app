import { useState } from "react";
import type { ApiState, IApiService } from "./types";

export interface useApiServiceHook {
  apiState: ApiState;
  apiService: IApiService;
}

export default function useApiService(
  apiService: IApiService,
): useApiServiceHook {
  const [apiState, setApiState] = useState<ApiState>(apiService.getApiState());

  apiService.addStateUpdateListener((newState) => {
    setApiState({ ...newState });
  });

  return {
    apiState,
    apiService,
  };
}
