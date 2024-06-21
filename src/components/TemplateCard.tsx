// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Template } from '@developer-platform/entities';
import GitHubIcon from '@mui/icons-material/GitHub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RocketLaunch from '@mui/icons-material/RocketLaunch';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, IconButton, Menu, MenuItem, Popover, Stack, SvgIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AzureLogo from '../assets/azure.svg?react';


const getProviderIcon = (provider?: string) => {
    switch (provider?.toLowerCase()) {
        case 'devcenter.azure.com': return <SvgIcon fontSize='large' component={AzureLogo} />;
        case 'github.com': return <GitHubIcon fontSize='large' />;
    }
    return undefined;
};

export interface ITemplateCardProps {
    template: Template;
}

export const TemplateCard: React.FC<ITemplateCardProps> = (props) => {

    const { template } = props;

    const theme = useTheme();

    const navigate = useNavigate();

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const menuOpen = Boolean(menuAnchorEl);
    const popoverOpen = Boolean(popoverAnchorEl);

    const handlePopoverClose = () => {
        setPopoverAnchorEl(null);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    return (
        <Card sx={{ p: 1 }}>
            <CardHeader sx={{ pt: theme.spacing(3), minHeight:'92px', maxHeight:'92px' }}
                avatar={getProviderIcon(template.metadata!.provider)}
                action={
                    <IconButton onClick={handleMenuClick} aria-label='settings'>
                        <MoreVertIcon />
                    </IconButton>
                }
                title={template.metadata!.title ?? template.metadata!.name}
                titleTypographyProps={{ fontSize: 'large'}}
                // subheader={template.kind}
                // subheaderTypographyProps={{ fontSize: 'small' }}
            />
            <Divider />
            <CardContent sx={{ pt: 2 }}>
                <Typography variant='subtitle2' gutterBottom component='div' overflow='scroll'
                    minHeight={template.metadata.tags ? '230px' : '260px'}
                    maxHeight={template.metadata.tags ? '230px' : '260px'}>
                    {template.metadata.description}
                </Typography>

                <Stack pb='18px' pt='10px'
                    minHeight={template.metadata.tags ? '90px' : '60px'}
                    maxHeight={template.metadata.tags ? '90px' : '60px'}>
                    <Typography variant='overline' display='block' gutterBottom component='div'>
                        Tags
                    </Typography>
                    {template.metadata.tags && (
                        <Stack direction='row'  overflow='scroll' spacing={1}>
                            {template.metadata.tags.map((tag, index) => (
                                <Chip key={index} label={tag} size='small' color='secondary' variant="outlined" />
                            ))}
                        </Stack>
                    )}
                </Stack>

            </CardContent>
            <CardActions sx={{justifyContent: 'space-between', paddingBottom: theme.spacing(2)}}>
                <Stack pl={1}>
                    <Stack direction='row' spacing={1}>
                        {template.spec.creates ? template.spec.creates?.map((plan, index) => (
                            <Chip key={index} label={plan.kind} color='primary' variant="outlined" />
                        )) : (
                            <Chip label='Automation' color='primary' variant="outlined" />
                        )}
                    </Stack>
                </Stack>
                <Button
                    color='inherit'
                    variant='outlined'
                    startIcon={<RocketLaunch />}
                    onClick={() => navigate(`/new/${template.ref.provider}/${template.ref.namespace}/${template.ref.name}`)}>
                        Create...
                </Button>
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
                <Popover
                    open={popoverOpen}
                    anchorEl={popoverAnchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right', }}>
                    <Button color='inherit' sx={{ padding: theme.spacing(1, 2) }} startIcon={<LibraryBooksIcon color='info' />}>
                        View docs
                    </Button>
                </Popover>
            </CardActions>
        </Card>
    );
};