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
        case 'devcenter.azure.com': return <SvgIcon fontSize='large' component={AzureLogo} />;
        case 'github.com': return <GitHubIcon fontSize='large' />;
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

    const spacingMultiplier = (space: number) => {
        if (entity.metadata.tags)
            space -= 30;
        if (entity.metadata.labels)
            space -= 90;
        return `${space}px`;
    };

    return (
        <Card sx={{ p: 1 }}>
            <CardHeader sx={{ pt: theme.spacing(3), minHeight:'92px', maxHeight:'92px' }}
                avatar={getProviderIcon(entity.metadata!.provider)}
                action={
                    <IconButton onClick={handleMenuClick} aria-label='settings'>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={(entity.metadata!.title ?? entity.metadata!.name)}
                titleTypographyProps={{ fontSize: 'large'}}
            />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
                <Typography variant='subtitle2' gutterBottom component='div' overflow='scroll'
                    minHeight={spacingMultiplier(230)}
                    maxHeight={spacingMultiplier(230)}>
                    {entity.metadata.description}
                </Typography>

                <Stack pb='18px' pt='10px'
                    minHeight={entity.metadata.labels ? '150px' : '60px'}
                    maxHeight={entity.metadata.labels ? '150px' : '60px'}>
                    <Typography variant='overline' display='block' gutterBottom component='div'>
                        Labels
                    </Typography>
                    {entity.metadata.labels && (
                        <Stack overflow='scroll'>
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
                </Stack>

                <Stack pb='18px' pt='10px'
                    minHeight={entity.metadata.tags ? '90px' : '60px'}
                    maxHeight={entity.metadata.tags ? '90px' : '60px'}>
                    <Typography variant='overline' display='block' gutterBottom component='div'>
                        Tags
                    </Typography>
                    {entity.metadata.tags && (
                        <Stack direction='row' overflow='scroll' spacing={1}>
                            {entity.metadata.tags.map((tag, index) => (
                                <Chip key={entity.ref.name + tag + index} label={tag} size='small' color='secondary' variant="outlined" />
                            ))}
                        </Stack>
                    )}
                </Stack>
            </CardContent>

            <CardActions>
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