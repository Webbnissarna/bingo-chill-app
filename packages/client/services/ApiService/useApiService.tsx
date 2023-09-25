import { useState } from "react";
import type { ApiState, IApiService } from "./types";

export interface useApiServiceHook {
  apiState: ApiState;
}

export default function useApiService(
  apiService: IApiService,
): useApiServiceHook {
  const [apiState, setApiState] = useState<ApiState>(apiService.getApiState());

  apiService.addStateUpdateListener(setApiState);

  return {
    apiState,
  };
}
