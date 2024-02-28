// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Entity } from '@developer-platform/entities';
import GitHubIcon from '@mui/icons-material/GitHub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Card, CardActions, CardContent, CardHeader, Chip, Divider, IconButton, Menu, MenuItem, Stack, SvgIcon, Typography, useTheme } from '@mui/material';
import React from 'react';
import AzureLogo from '../assets/azure.svg?react';


const getProviderIcon = (provider?: string) => {
    switch (provider?.toLowerCase()) {
        case 'devcenter.azure.com': return <SvgIcon fontSize='inherit' component={AzureLogo} />;
        case 'github.com': return <GitHubIcon fontSize='inherit' />;
    }
    return undefined;
};

export interface IEntityCardProps {
    entity: Entity;
}

export const EntityCard: React.FC<IEntityCardProps> = (props) => {

    const { entity } = props;

    const theme = useTheme();

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const menuOpen = Boolean(menuAnchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <Card sx={{ p: 1 }}>
            <CardHeader sx={{ pt: theme.spacing(3) }}
                action={<IconButton onClick={handleMenuClick} aria-label='settings'>
                    <MoreVertIcon />
                </IconButton>}
                title={(
                    <Stack direction='row' pb={theme.spacing(1)} spacing={1} alignItems='center'>
                        <strong>{entity.metadata!.title ?? entity.metadata!.name}</strong>
                        {getProviderIcon(entity.metadata!.provider)}
                    </Stack>
                )}
            />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
                {entity.metadata.description && (
                    <Typography variant='subtitle2' gutterBottom component='div'
                        minHeight={entity.metadata.labels ? '100px' : '180px'}
                        maxHeight={entity.metadata.labels ? '100px' : '180px'}>
                        {entity.metadata.description}
                    </Typography>
                )}

                {entity.metadata.labels && (
                    <Stack pb='20px'>
                        <Typography variant='overline' display='block' gutterBottom component='div'>
                            {/* Labels */}
                        </Typography>
                            {Object.keys(entity.metadata.labels).map((label, index) => label.endsWith('resource-group-id') ? <></> : (
                                <Stack direction='row' spacing={1} alignItems='baseline' justifyContent='flex-start' key={entity.ref.name + label + index}>
                                    <Typography variant='subtitle2' color={theme.palette.text.primary}>
                                        {label.split('/')[label.split('/').length - 1]}:
                                    </Typography>
                                    <Typography variant='caption'>
                                        {entity.metadata.labels![label]}
                                    </Typography>
                                </Stack>
                            ))}
                    </Stack>
                )}

                {entity.metadata.tags && (
                    <Stack pb='20px'>
                        <Typography variant='overline' display='block' gutterBottom component='div'>
                            Tags
                        </Typography>
                        <Stack direction='row' spacing={1}>
                            {entity.metadata.tags.map((tag, index) => (
                                <Chip key={entity.ref.name + tag + index} label={tag} size='small' color='secondary' variant="outlined" />
                            ))}
                        </Stack>
                    </Stack>
                )}
            </CardContent>

            <CardActions sx={{
                justifyContent: entity.spec.creates ? 'space-between' : 'flex-end',
                paddingBottom: theme.spacing(2)
            }}>
                {entity.spec.creates && (
                    <Stack pl={1}>
                        <Stack direction='row' spacing={1}>
                            {/* {entity.spec.creates?.map((plan, index) => (
                                <Chip key={index} label={plan.kind} color='primary' variant="outlined" />
                            ))} */}
                        </Stack>
                    </Stack>
                )}

                <Menu
                    open={menuOpen}
                    anchorEl={menuAnchorEl}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                    <MenuItem onClick={handleMenuClose}>
                        <LibraryBooksIcon sx={{ marginRight: theme.spacing(1) }} fontSize='medium' color='info' />
                        View docs
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <ManageSearchIcon sx={{ marginRight: theme.spacing(1) }} fontSize='medium' color='info' />
                        See existing
                    </MenuItem>
                </Menu>

            </CardActions>
        </Card>
    );
};