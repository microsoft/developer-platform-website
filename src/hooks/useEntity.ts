// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { EntityRef, Environment, Operation, Provider, Repository, Template } from '@developer-platform/entities';
import { useQuery } from '@tanstack/react-query';
import { getEntity } from '../API';
import { createEntityRef } from '../model';

export const useEntity = (ref: EntityRef) => {
  const isAuthenticated = useIsAuthenticated();

  // normalize the ref
  ref = createEntityRef(ref.kind, ref.provider, ref.namespace, ref.name);

  return useQuery({
    queryKey: ['entities', ref.kind, ref.provider, ref.namespace, ref.name],
    queryFn: async () => {
      console.log(`Fetching ${ref.kind} entity ${ref.id}`);

      const entity = await getEntity(ref);

      console.log(`Found ${entity.kind} entity ${entity.ref.id}`);

      if (entity.ref.kind.toLowerCase() === 'environment') {
        return entity as Environment;
      }

      if (entity.ref.kind.toLowerCase() === 'operation') {
        return entity as Operation;
      }

      if (entity.ref.kind.toLowerCase() === 'provider') {
        return entity as Provider;
      }

      if (entity.ref.kind.toLowerCase() === 'repository') {
        return entity as unknown as Repository;
      }

      if (entity.ref.kind.toLowerCase() === 'template') {
        return entity as unknown as Template;
      }

      return entity;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: isAuthenticated,
  });
};
