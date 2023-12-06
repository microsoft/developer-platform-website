// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useIsAuthenticated } from '@azure/msal-react';
import { ProviderAuth } from '@developer-platform/entities';
import { useQuery } from '@tanstack/react-query';

export const useProviderAuth = () => {
    const isAuthenticated = useIsAuthenticated();

    return useQuery(['providers', 'auth'], () => [] as ProviderAuth[], {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        enabled: isAuthenticated,
    });
};
