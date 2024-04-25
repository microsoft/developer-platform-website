// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useContext } from 'react';
import { auth } from '../API';
import { getVersion } from '../Utils';
import { useApiVersion } from '../hooks';
import { GraphUser } from '../model';
import { MemberAvatar } from './MemberAvatar';
import { ColorModeContext } from './RootView';

export interface IMemberDetailsProps {
    user: GraphUser;
    signout?: boolean;
}

export const MemberDetails: React.FC<IMemberDetailsProps> = (props) => {

    const { user, signout } = props;

    const theme = useTheme();

    const colorMode = useContext(ColorModeContext);

    const version = getVersion();
    const { data: apiVersion } = useApiVersion();

    return (
        <Stack>
            <Stack pt={3} px={3} pb={1} alignItems='center' direction='row'>
                <MemberAvatar user={user} sx={{ m: theme.spacing(2), width: 96, height: 96 }} />
                <Stack direction='column' p={theme.spacing(2, 3)} >
                    <Typography variant='h6' component='div'>
                        {user.displayName}
                    </Typography>
                    <Typography variant='body2' color={theme.palette.text.secondary} gutterBottom component='div'>
                        {user.jobTitle}
                    </Typography>
                    <Typography variant='body2' color={theme.palette.text.secondary} gutterBottom component='div'>
                        {user.department}
                    </Typography>
                    {signout && (
                        <Button sx={{ pl: 0, justifyContent: 'flex-start' }} size='small' onClick={auth.logout}>Sign out</Button>
                    )}
                </Stack>
            </Stack>

            {signout && (
                <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center'}}>
                    <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tooltip title="website version" placement="bottom-start" >
                            <Button href={`https://github.com/microsoft/developer-platform-website/releases/tag/v${version}`}
                                target='_blank' rel='noopener noreferrer' size='small'
                                sx={{ p: 0, ml: 1, textTransform: 'none', color: 'inherit', '&:hover': { backgroundColor: 'inherit' } }}>
                                v{version}
                            </Button>
                        </Tooltip>
                        <Tooltip title="api version" placement="bottom-start" >
                            <Button href={`https://github.com/microsoft/developer-platform/releases/tag/v${apiVersion}`}
                                target='_blank' rel='noopener noreferrer' size='small'
                                sx={{ p: 0, ml: 0, textTransform: 'none', color: 'inherit', fontWeight: 300, fontStyle: 'italic', '&:hover': { backgroundColor: 'inherit' } }}>
                                (v{apiVersion})
                            </Button>
                        </Tooltip>
                    </Stack>
                    <IconButton size='small' disableRipple sx={{ mr: 1, mb: 1, '&:hover': { backgroundColor: 'inherit' } }} onClick={colorMode.toggleColorMode} color='inherit'>
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Stack>
            )}
        </Stack>
    );
};