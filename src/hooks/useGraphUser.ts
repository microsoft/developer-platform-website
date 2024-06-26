// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '../MSGraph';

export const useGraphUser = () => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: ['graphUser', 'me'],
    queryFn: async () => await getMe(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: isAuthenticated,
  });
};
