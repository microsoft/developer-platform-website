// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useQuery } from '@tanstack/react-query';
import { getApiVersion } from '../API';

export const useApiVersion = () => {
  return useQuery({
    queryKey: ['api', 'version'],
    queryFn: async () => {
      console.log(`Fetching api version`);

      const version = await getApiVersion();

      console.log(`Found api version ${version}`);

      return version;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
