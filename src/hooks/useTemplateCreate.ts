// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Entity, Operation } from '@developer-platform/entities';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { create } from '../API';
import { CreatePayload } from '../model';

export const useTemplateCreate = () => {
  // const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreatePayload) => {
      const entity = await create(payload.ref, payload.input);
      return entity;
    },
    onSuccess: async (_data: Entity | Operation, _variables: CreatePayload, _context: unknown) => {
      navigate('/new');
    },
  }).mutateAsync;
};
