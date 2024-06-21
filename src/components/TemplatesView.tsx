// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Template } from '@developer-platform/entities';
import { Box, CircularProgress, Grid } from '@mui/material';
import React from 'react';
import { useEntities } from '../hooks';
import { TemplateCard } from './TemplateCard';


export interface ITemplatesViewProps { }

export const TemplatesView: React.FC<ITemplatesViewProps> = () => {

    const { data: templates, isLoading } = useEntities('template');

    if (isLoading)
        return (<Box sx={{ display: 'flex', minHeight: '300px', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>);

    return (
        <Grid container spacing={4} >
            {templates?.map(template => (
                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={template.ref.id}>
                    <TemplateCard template={template as Template} />
                </Grid>
            ))}
        </Grid>
    );
};
