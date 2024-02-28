// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { EntityRef, Environment, Operation, Provider, Repository, Template } from '@developer-platform/entities';
import { useQuery } from '@tanstack/react-query';
import { getEntity } from '../API';

export const useEntity = (ref: EntityRef) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery(
    [
      'entities',
      ref.kind.toLowerCase(),
      ref.provider.toLowerCase(),
      ref.namespace?.toLowerCase() ?? 'default',
      ref.name.toLowerCase(),
    ],
    async () => {
      console.log(`Fetching ${ref.kind} entity ${ref.kind}:${ref.provider}/${ref.namespace ?? 'default'}/${ref.name}`);

      const entity = await getEntity(ref);

      console.log(
        `Found ${entity.kind} entity ${entity.ref.kind}:${entity.ref.provider}/${entity.ref.namespace}/${entity.ref.name}`
      );

      if (entity.kind.toLowerCase() === 'environment') {
        return entity as Environment;
      }

      if (entity.kind.toLowerCase() === 'operation') {
        return entity as Operation;
      }

      if (entity.kind.toLowerCase() === 'provider') {
        return entity as Provider;
      }

      if (entity.kind.toLowerCase() === 'repository') {
        return entity as unknown as Repository;
      }

      if (entity.kind.toLowerCase() === 'template') {
        return entity as unknown as Template;
      }

      return entity;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      enabled: isAuthenticated,
    }
  );
};
