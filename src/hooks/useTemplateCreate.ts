// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Operation } from '@developer-platform/entities';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { create } from '../API';
import { sleep } from '../Utils';
import { CreatePayload } from '../model';

export const useTemplateCreate = () => {
    // const isAuthenticated = useIsAuthenticated();

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    return useMutation(
        async (payload: CreatePayload) => {
            const operation = await create(payload.ref, payload.input);
            return operation;
        },
        {
            onSuccess: async (data: Operation, variables: CreatePayload, context: unknown) => {
                const sleepSeconds = 3;
                navigate(`/new`);
                console.log(`Invalidating entities after ${sleepSeconds} seconds...`);
                await sleep(sleepSeconds * 1000);
                console.log(`Invalidating entities`);
                queryClient.invalidateQueries(['entities'], { type: 'all' });
            }
        }
    ).mutateAsync;
};
