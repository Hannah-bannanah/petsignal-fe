import { TextInput, Textarea, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import {useEffect} from "react";

export default function AlertDetail({ initialValues, readOnly, onSubmit }) {
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            username: '',
            type: 'LOST',
            chipNumber: '',
            sex: 'UNKNOWN',
            date: '',
            breed: '',
            postalCode: '',
            countryCode: '',
            ...initialValues
        }
    });

    useEffect(() => {
        if (initialValues) {
            form.setValues(initialValues);
        } else {
            form.reset();
        }
    }, [initialValues]);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput label="Title" {...form.getInputProps('title')} readOnly={readOnly} />
            <Textarea label="Description" {...form.getInputProps('description')} readOnly={readOnly} />
            <TextInput label="Username" {...form.getInputProps('username')} readOnly />
            <Select label="Type" data={['LOST', 'FOUND']} {...form.getInputProps('type')} disabled={readOnly} />
            <TextInput label="Chip Number" {...form.getInputProps('chipNumber')} readOnly={readOnly} />
            <Select label="Sex" data={['MALE', 'FEMALE', 'UNKNOWN']} {...form.getInputProps('sex')} disabled={readOnly} />
            <TextInput label="Date" type="date" {...form.getInputProps('date')} readOnly={readOnly} />
            <TextInput label="Breed" {...form.getInputProps('breed')} readOnly={readOnly} />
            <TextInput label="Postal Code" {...form.getInputProps('postalCode')} readOnly={readOnly} />
            <TextInput label="Country" {...form.getInputProps('countryCode')} readOnly={readOnly} />
        </form>
    );
}
