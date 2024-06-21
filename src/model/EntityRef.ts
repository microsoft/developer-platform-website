// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Entity, EntityRef } from '@developer-platform/entities';

export const getEntityRef = (entity: Entity): EntityRef => {
  const kind = entity.kind.toLowerCase();
  const provider = entity.metadata.provider.toLowerCase();
  const namespace = entity.metadata.namespace?.toLowerCase() ?? 'default';
  const name = entity.metadata.name.toLowerCase();
  const id = `${kind}:${provider}/${namespace}/${name}`;
  return { kind, provider, namespace, name, id };
};

export const createEntityRef = (
  kind: string,
  provider: string,
  namespace: string = 'default',
  name: string
): EntityRef => {
  const k = kind.toLowerCase();
  const p = provider.toLowerCase();
  const ns = namespace.toLowerCase();
  const n = name.toLowerCase();
  return { kind: k, provider: p, namespace: ns, name: n, id: `${k}:${p}/${ns}/${n}` };
};
