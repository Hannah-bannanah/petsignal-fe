import {Button, Group, Select, Textarea, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useEffect} from "react";
import {makeReadOnlyStyles} from "../../utils/readOnlyStyles.js";
import AlertPhotos from "./AlertPhotos.jsx";

export default function AlertDetail({initialValues, readOnly, onSubmit, onCancel, setSelectedFiles}) {
    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            user: {...(initialValues?.user || {username: '', id: ''}) },
            type: 'LOST',
            chipNumber: '',
            sex: 'UNKNOWN',
            date: '',
            breed: '',
            postalCode: '',
            countryCode: '',
            photoUrls: [],
            photoFilenames: [],
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

    useEffect(() => {
        form.reset()
    }, [readOnly]);

    const roStyles = makeReadOnlyStyles(readOnly);

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <TextInput label="Title" {...form.getInputProps('title')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <Textarea label="Description" {...form.getInputProps('description')} readOnly={readOnly ? true : undefined}
                      styles={roStyles}/>
            <TextInput label="Username" {...form.getInputProps('user.username')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <input type="hidden" {...form.getInputProps('user.id')} />
            <Select label="Type" data={['LOST', 'SEEN']} {...form.getInputProps('type')}
                    readOnly={readOnly ? true : undefined} styles={roStyles}/>
            <TextInput label="Chip Number" {...form.getInputProps('chipNumber')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <Select label="Sex" data={['MALE', 'FEMALE', 'UNKNOWN']} {...form.getInputProps('sex')}
                    styles={roStyles}/>
            <TextInput label="Date" type="date" {...form.getInputProps('date')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <TextInput label="Breed" {...form.getInputProps('breed')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <TextInput label="Postal Code" {...form.getInputProps('postalCode')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>
            <TextInput label="Country" {...form.getInputProps('countryCode')} readOnly={readOnly ? true : undefined}
                       styles={roStyles}/>

            {!readOnly && (<input
                type="file"
                multiple
                onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            />)}
            {form.values.photoUrls?.length > 0 && (
                <AlertPhotos photos={form.values.photoUrls}/>
            )}

            <Group position="right" mt="md">
                {
                    !readOnly && (<Button type="button" onClick={onCancel} variant="light">Cancel</Button>)
                }

                <Button type="submit">{readOnly ? 'Close' : 'Save'}</Button>
            </Group>
        </form>
    );
}
