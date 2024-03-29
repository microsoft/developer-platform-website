// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Client as GraphClient, GraphError, ResponseType } from '@microsoft/microsoft-graph-client';
import { auth } from './API';
import { GraphGroup } from './model/GraphGroup';
import { GraphPrincipal } from './model/GraphPrincipal';
import { GraphServicePrincipal } from './model/GraphServicePrincipal';
import { GraphUser } from './model/GraphUser';

export enum PhotoSize {
  size48x48 = '48x48',
  size64x64 = '64x64',
  size96x96 = '96x96',
  size120x120 = '120x120',
  size240x240 = '240x240',
  size360x360 = '360x360',
  size432x432 = '432x432',
  size504x504 = '504x504',
  size648x648 = '648x648',
}

const Client = GraphClient;
const client = Client.initWithMiddleware({ authProvider: auth });

const _userSelect = [
  'id',
  'userPrincipalName',
  'displayName',
  'givenName',
  'surname',
  'mail',
  'otherMails',
  'companyName',
  'jobTitle',
  'preferredLanguage',
  'userType',
  'department',
];
const _groupSelect = ['id', 'displayName', 'mail'];
const _servicePrincipalSelect = ['id', 'displayName', 'appId', 'appDisplayName'];

export const isPrincipalUser = (principal?: GraphPrincipal): principal is GraphUser => {
  return principal?.type?.toLowerCase() === 'user';
};

export const isPrincipalGroup = (principal?: GraphPrincipal): principal is GraphGroup => {
  return principal?.type?.toLowerCase() === 'group';
};

export const isPrincipalServicePrincipal = (principal?: GraphPrincipal): principal is GraphServicePrincipal => {
  return principal?.type?.toLowerCase() === 'serviceprincipal';
};

export const getMe = async (): Promise<GraphUser> => {
  const response = await client.api('/me').select(_userSelect).get();
  const me = response as GraphUser;
  me.type = 'User';
  if (me.userType?.toLowerCase() === 'member') me.imageUrl = await getMePhoto();
  return me;
};

export const getGraphPrincipal = async (): Promise<GraphPrincipal> => {
  return (await getMe()) as GraphPrincipal;
  // switch (user?.userType?.toLowerCase()) {
  //     case 'user':
  //         return (await getGraphUser(user.id)) as GraphPrincipal;
  //     case 'group':
  //         return (await getGraphGroup(user.id)) as GraphPrincipal;
  //     case 'service':
  //         return (await getGraphServicePrincipal(user.id)) as GraphPrincipal;
  // }
  // return undefined as any;
};

export const getGraphGroup = async (id: string): Promise<GraphGroup | null> => {
  try {
    const response = await client
      .api('/groups/' + id)
      .select(_groupSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const group = response as GraphGroup;
    group.type = 'Group';
    return group;
  } catch (error) {
    const graphError = error as GraphError;
    if (graphError.statusCode === 404) {
      console.warn(graphError);
      return null;
    } else {
      console.error(graphError);
      throw error;
    }
  }
};

export const getGraphUser = async (id: string): Promise<GraphUser | null> => {
  try {
    const response = await client
      .api('/users/' + id)
      .select(_userSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const user = response as GraphUser;
    user.type = 'User';
    // console.warn(user.userType ?? 'foo')
    // if (user.userType?.toLowerCase() === 'member')
    //     user.imageUrl = await getUserPhoto(user.id);
    return user;
  } catch (error) {
    const graphError = error as GraphError;
    if (graphError.statusCode === 404) {
      console.warn(graphError);
      return null;
    } else {
      console.error(graphError);
      throw error;
    }
  }
};

export const getGraphServicePrincipal = async (id: string): Promise<GraphServicePrincipal | null> => {
  try {
    const response = await client
      .api('/servicePrincipals/' + id)
      .select(_servicePrincipalSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const servicePrincipal = response as GraphServicePrincipal;
    servicePrincipal.type = 'ServicePrincipal';
    return servicePrincipal;
  } catch (error) {
    const graphError = error as GraphError;
    if (graphError.statusCode === 404) {
      console.warn(graphError);
      return null;
    } else {
      console.error(graphError);
      throw error;
    }
  }
};

export const getGraphGroups = async (): Promise<GraphGroup[]> => {
  try {
    const response = await client
      .api('/groups')
      .select(_groupSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const groups: GraphGroup[] = response.value;
    groups.forEach((g) => (g.type = 'Group'));
    return groups;
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};

export const getGraphUsers = async (): Promise<GraphUser[]> => {
  try {
    const response = await client
      .api('/users')
      .select(_userSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const users: GraphUser[] = response.value;
    users.forEach((u) => (u.type = 'User'));
    await Promise.all(
      users.map(
        async (u) => (u.imageUrl = u.userType?.toLowerCase() === 'member' ? await getUserPhoto(u.id) : undefined)
      )
    );
    return users;
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};

export const getGraphServicePrincipals = async (): Promise<GraphServicePrincipal[]> => {
  try {
    const response = await client
      .api('/servicePrincipals')
      .select(_servicePrincipalSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const servicePrincipals: GraphServicePrincipal[] = response.value;
    servicePrincipals.forEach((sp) => (sp.type = 'ServicePrincipal'));
    return servicePrincipals;
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};

export const searchGraphUsers = async (search: string): Promise<GraphUser[]> => {
  try {
    const response = await client
      .api('/users')
      .filter(`startswith(displayName,'${search}')`)
      .select(_userSelect)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    const users: GraphUser[] = response.value;
    users.forEach((u) => (u.type = 'User'));
    await Promise.all(
      users.map(
        async (u) => (u.imageUrl = u.userType?.toLowerCase() === 'member' ? await getUserPhoto(u.id) : undefined)
      )
    );
    return users;
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};

export const getMePhoto = async (size: PhotoSize = PhotoSize.size240x240): Promise<string | undefined> => {
  try {
    const api = `/me/photos/${size}/$value`;
    // let api = `/me/photo/$value`;
    const response = await client
      .api(api)
      .header('Cache-Control', 'no-cache')
      .version('beta') // currently only work in beta: https://github.com/microsoftgraph/msgraph-sdk-dotnet/issues/568
      .responseType(ResponseType.BLOB)
      .get();

    // console.warn(response);
    return URL.createObjectURL(response);
  } catch (error) {
    console.warn('Failed to get me photo.');

    if ((error as GraphError).statusCode === 404) return undefined;

    console.warn('Failed to get me photo.');
    console.warn(error as GraphError);

    // swollow this error see: https://docs.microsoft.com/en-us/graph/known-issues#photo-restrictions
    return undefined;
    // throw error;
  }
};

export const getUserPhoto = async (
  id: string,
  size: PhotoSize = PhotoSize.size240x240
): Promise<string | undefined> => {
  try {
    const api = `/users/${id}/photos/${size}/$value`;
    const response = await client
      .api(api)
      .header('Cache-Control', 'no-cache')
      .version('beta') // currently only work in beta: https://github.com/microsoftgraph/msgraph-sdk-dotnet/issues/568
      .responseType(ResponseType.BLOB)
      .get();
    // console.warn(response);
    return URL.createObjectURL(response);
  } catch (error) {
    console.warn(`Failed to get user photo (${id}).`);

    if ((error as GraphError).statusCode === 404) return undefined;

    console.warn(`Failed to get user photo (${id}).`);
    console.error(error as GraphError);

    // swollow this error see: https://docs.microsoft.com/en-us/graph/known-issues#photo-restrictions
    return undefined;
    // throw error;
  }
};

export const getGraphDirectoryObject = async (id: string): Promise<GraphUser> => {
  try {
    const response = await client
      .api('/directoryObjects/' + id)
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    return response as GraphUser;
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};

export const getGraphDirectoryObjects = async (): Promise<GraphUser[]> => {
  try {
    const response = await client
      .api('/directoryObjects')
      // .header('X-PeopleQuery-QuerySources', 'Directory')
      .get();
    return response.value as GraphUser[];
  } catch (error) {
    console.error(error as GraphError);
    throw error;
  }
};
