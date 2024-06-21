// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Entity, EntityRef, Operation, ProviderAuth, ProviderLogin } from '@developer-platform/entities';
import { Auth } from './Auth';
import { getEntityRef, getProviderAuths } from './model';

const _getApiUrl = () => {
  // allow for injected value (i.e. string replacement)
  const injected = '__VITE_API_URL__';
  if (injected && injected.length > 0 && !injected.startsWith('__')) return injected;

  if (!import.meta.env.VITE_API_URL) throw new Error('Must set env variable $VITE_API_URL');

  return import.meta.env.VITE_API_URL;
};

export const apiUrl = _getApiUrl();

export const auth = new Auth();

export const callApi = async (path: string): Promise<Response> => {
  const url = `${apiUrl}/${path}`;

  try {
    const token = await auth.getTokenHeader('{$host}/.default');

    if (!token) throw new Error('Failed to get token.');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      console.error(response);
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEntity = async (ref: EntityRef): Promise<Entity> => {
  const response = await callApi(`entities/${ref.kind}/${ref.provider}/${ref.namespace ?? 'default'}/${ref.name}`);

  const entity = (await response.json()) as Entity;
  entity.ref = getEntityRef(entity);

  return entity;
};

export const getEntitiesByKind = async (
  kind: string
): Promise<{ entities: Entity[]; providerAuth: ProviderAuth[] }> => {
  const path = `entities/${kind}`;
  const response = await callApi(path);

  const entities = (await response.json()) as Entity[];

  for (const entity of entities) {
    entity.ref = getEntityRef(entity);
  }

  const providerAuth = getProviderAuths(response.headers);

  return { entities, providerAuth };
};

export const create = async (ref: EntityRef, input: unknown): Promise<Entity | Operation> => {
  const url = `${apiUrl}/entities/template/${ref.provider}/${ref.namespace ?? 'default'}/${ref.name}`;

  try {
    const token = await auth.getTokenHeader('{$host}/.default');

    if (!token) throw new Error('Failed to get token.');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      console.error(response);
    }

    const entity = (await response.json()) as Entity;

    entity.ref = getEntityRef(entity);

    if (entity.kind.toLowerCase() === 'operation') {
      return entity as Operation;
    }

    return entity;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// version endpoint is not protected by auth
export const getApiVersion = async (): Promise<string> => {
  const url = `${apiUrl}/version`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      console.error(response);
    }

    return response.text();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProviderLogin = async (providerAuth: ProviderAuth, redirectUri: string): Promise<ProviderLogin> => {
  const url = `${providerAuth.authorizationUri}?redirect_uri=${redirectUri}`;

  console.log(`Get provider login: ${url}`);

  try {
    const token = await auth.getTokenHeader(providerAuth.scopes);

    if (!token) throw new Error('Failed to get token.');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    if (!response.ok) {
      console.error(response);
    }

    return (await response.json()) as ProviderLogin;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
