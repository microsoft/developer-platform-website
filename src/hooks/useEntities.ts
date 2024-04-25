// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { Environment, Operation, Provider, Repository, Template } from '@developer-platform/entities';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEntities } from '../API';

export const useEntities = (kind: string) => {
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['entities', kind.toLowerCase()],
    queryFn: async () => {
      console.log(`Fetching ${kind} entities`);

      const { entities, providerAuth } = await getEntities(kind);

      console.log(`Found ${entities.length} ${kind} entities`);
      console.log(`Found ${providerAuth.length} provider auths`);

      if (providerAuth.length > 0) {
        queryClient.setQueryData(['providers', 'auth'], providerAuth);
      }

      if (kind.toLowerCase() === 'environment') {
        return entities as Environment[];
      }

      if (kind.toLowerCase() === 'operation') {
        return entities as Operation[];
      }

      if (kind.toLowerCase() === 'provider') {
        return entities as Provider[];
      }

      if (kind.toLowerCase() === 'repository') {
        return entities as unknown as Repository[];
      }

      if (kind.toLowerCase() === 'template') {
        return entities as unknown as Template[];
      }

      return entities;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: isAuthenticated,
  });
};
