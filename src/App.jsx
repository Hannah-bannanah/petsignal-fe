// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
    AppShell, Container, Title, Button, Table, Group, Modal,
    TextInput, Textarea, Stack, Paper, Divider, Box, Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/alerts'; // Change to your backend

export default function App() {
    const [alerts, setAlerts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
        },
    });

    const fetchAlerts = async () => {
        try {
            const res = await axios.get(API_URL);
            setAlerts(res.data.content);
        } catch (err) {
            console.error('Failed to fetch alerts:', err);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editing) {
                await axios.put(`${API_URL}/${editing.id}`, values);
            } else {
                await axios.post(API_URL, values);
            }
            fetchAlerts();
            form.reset();
            setEditing(null);
            setModalOpen(false);
        } catch (err) {
            console.error('Error submitting form:', err);
        }
    };

    const handleEdit = (alert) => {
        form.setValues(alert);
        setEditing(alert);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAlerts();
        } catch (err) {
            console.error('Failed to delete alert:', err);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <AppShell padding="md">
            <Container>
                <Title order={2} mb="lg" align="center">🐾 Pet Alerts</Title>

                <Paper withBorder shadow="sm" p="lg" radius="md">
                    <Group position="apart" mb="md">
                        <Title order={4}>All Alerts</Title>
                        <Button onClick={() => { form.reset(); setEditing(null); setModalOpen(true); }}>
                            + New Alert
                        </Button>
                    </Group>

                    <Divider my="sm" />

                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {alerts.length === 0 ? (
                            <tr>
                                <td colSpan={3}><Center>No alerts found.</Center></td>
                            </tr>
                        ) : (
                            alerts.map((alert) => (
                                <tr key={alert.id}>
                                    <td>{alert.title}</td>
                                    <td>{alert.description}</td>
                                    <td>
                                        <Group gap="xs">
                                            <Button size="xs" variant="light" onClick={() => handleEdit(alert)}>Edit</Button>
                                            <Button size="xs" color="red" variant="light" onClick={() => handleDelete(alert.id)}>Delete</Button>
                                        </Group>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                </Paper>
            </Container>

            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? 'Edit Alert' : 'New Alert'}
                centered
                size="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Title"
                            placeholder="Lost dog in park"
                            withAsterisk
                            {...form.getInputProps('title')}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Friendly dog, last seen near the lake"
                            minRows={3}
                            withAsterisk
                            {...form.getInputProps('description')}
                        />
                        <Group position="right" mt="md">
                            <Button variant="default" onClick={() => setModalOpen(false)}>Cancel</Button>
                            <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </AppShell>
    );
}
