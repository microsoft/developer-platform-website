// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { Environment, Operation, Provider, Repository, Template } from '@developer-platform/entities';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEntitiesByKind } from '../API';

export const useEntities = (kind: string) => {
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();

  kind = kind.toLowerCase();

  return useQuery({
    queryKey: ['entities', kind],
    queryFn: async () => {
      console.log(`Fetching ${kind} entities`);

      const { entities, providerAuth } = await getEntitiesByKind(kind);

      console.log(`Found ${entities.length} ${kind} entities`);
      console.log(`Found ${providerAuth.length} provider auths`);

      if (providerAuth.length > 0) {
        queryClient.setQueryData(['providers', 'auth'], providerAuth);
      }

      if (kind === 'environment') {
        return entities as Environment[];
      }

      if (kind === 'operation') {
        return entities as Operation[];
      }

      if (kind === 'provider') {
        return entities as Provider[];
      }

      if (kind === 'repository') {
        return entities as unknown as Repository[];
      }

      if (kind === 'template') {
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
