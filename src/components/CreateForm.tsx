// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Template } from '@developer-platform/entities';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, CircularProgress, Stack, SvgIcon, Typography, useTheme } from '@mui/material';
import { IChangeEvent } from '@rjsf/core';
import { Form } from '@rjsf/mui';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AzureLogo from '../assets/azure.svg?react';
import { useEntities, useTemplateCreate } from '../hooks';
import { CreatePayload } from '../model';

export interface ICreateFormProps {}

export const CreateForm: React.FC<ICreateFormProps> = () => {

    const { provider, namespace, name } = useParams();

    const { data: templates, isLoading } = useEntities('template');

    const create = useTemplateCreate();

    const [template, setTemplate] = useState<Template>();

    const [formEnabled, setFormEnabled] = useState<boolean>(true);

    useEffect(() => {
        if (!isLoading && templates && provider && namespace && name) {
            const template = templates.find(t =>
                t.ref.provider === provider.toLowerCase()
                && t.ref.namespace === namespace.toLowerCase()
                && t.ref.name === name.toLowerCase()) as Template;

            if (template)
                setTemplate(template);
        }
    }, [isLoading, templates, provider, namespace, name]);

    const onSubmit = async (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: IChangeEvent<any, RJSFSchema, any>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        _event: FormEvent<any>
    ) => {
        console.log('Data submitted: ', data.formData);

        if (template) {
            setFormEnabled(false);

            const payload: CreatePayload = {
                ref: template.ref,
                input: data.formData,
            };

            console.log('CreatePayload:', payload);

            console.log('Submitting form...');

            // const operation = await create(payload);
            await create(payload);

            console.log('Done.');
        }
    };

    const theme = useTheme();

    const getProviderIcon = (provider?: string) => {
        switch (provider?.toLowerCase()) {
            case 'devcenter.azure.com': return <SvgIcon fontSize='inherit' component={AzureLogo} />;
            case 'github.com': return <GitHubIcon fontSize='inherit' />;
        }
        return undefined;
    };

    if (isLoading || !formEnabled)
        return (<Box sx={{ display: 'flex', minHeight: '300px', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </Box>);

    return template ? (
        <Stack spacing={3} pt={1}>
            <Stack direction='row' pb={theme.spacing(1)} spacing={1} alignItems='center'>
                <Typography variant='h3' display='block' gutterBottom component='div'>
                    {/* <strong>{template.metadata!.title ?? template.metadata!.name}</strong> */}
                    {template.metadata!.title ?? template.metadata!.name}
                </Typography>
                <Typography variant='h3' display='block' >
                    {getProviderIcon(template.metadata!.provider)}
                </Typography>
            </Stack>

            <Typography variant='body1' display='block' gutterBottom>
                {template.metadata.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Form
                    disabled={!formEnabled}
                    validator={validator}
                    onSubmit={onSubmit}
                    schema={template.spec.inputJsonSchema ? JSON.parse(template.spec.inputJsonSchema) : {}}
                    uiSchema={template.spec.inputUiSchema ? JSON.parse(template.spec.inputUiSchema) : {}}>
                </Form>
            </Box>
        </Stack>

    )  : <> </>;
};