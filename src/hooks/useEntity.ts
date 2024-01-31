// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { EntityRef, Template } from '@developer-platform/entities';
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
            ref.name.toLowerCase()
        ],
        async () => {
            console.log(
                `Fetching ${ref.kind} entity ${ref.kind}:${ref.provider}/${ref.namespace ?? 'default'}/${ref.name}`
            );

            const entity = await getEntity(ref);

            console.log(
                `Found ${entity.kind} entity ${entity.ref.kind}:${entity.ref.provider}/${entity.ref.namespace}/${entity.ref.name}`
            );

            return entity.kind.toLowerCase() === 'template' ? (entity as Template) : entity;
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 2, // 2 minutes
            enabled: isAuthenticated
        }
    );
};
