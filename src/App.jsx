import {useState, useEffect} from 'react';
import {AppShell, Container, Divider, Paper} from '@mantine/core';
import Header from './components/Header';
import AlertList from './components/AlertList';
import AlertDetail from './components/AlertDetail';
import axios from "axios";

const API_URL = 'http://localhost:8080/api/v1/alerts';

export default function App() {
    const [alerts, setAlerts] = useState([]); // This should be fetched from your API
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'create'
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`${API_URL}`)
            .then((res) => setAlerts(res.data.content))
            .catch((err) => console.error('Failed to fetch alerts', err));
    }, []);

    const openModal = (mode, alert = null) => {
        setModalMode(mode);
        setSelectedAlert(alert);
        setModalOpen(true);
    };

    const handleSubmit = (alert) => {
        if (modalMode === 'create') {
            // Logic for creating a new alert (POST to API)
            setAlerts([...alerts, alert]); // Add the new alert to state
        } else if (modalMode === 'edit') {
            // Logic for editing an existing alert (PUT to API)
            const updatedAlerts = alerts.map((a) =>
                a.id === alert.id ? {...a, ...alert} : a
            );
            setAlerts(updatedAlerts); // Update the alert in state
        }
        setModalOpen(false); // Close modal after submit
    };

    const handleDelete = (alertId) => {
        // Logic for deleting an alert (DELETE from API)
        const updatedAlerts = alerts.filter((alert) => alert.id !== alertId);
        setAlerts(updatedAlerts); // Remove the alert from state
        setModalOpen(false); // Close modal after deletion
    };

    return (
        <AppShell padding="md">
            <Container>
                <Header onNewAlert={() => openModal('create')}/>

                <Paper withBorder shadow="sm" p="lg" radius="md">
                    <AlertList
                        alerts={alerts}
                        onEdit={(alert) => openModal('edit', alert)}
                        onDelete={handleDelete}
                        onViewDetail={(alert) => openModal('view', alert)}/>
                </Paper>

                <Divider my="lg"/>

                {modalOpen && modalMode && (
                    <AlertDetail
                        opened={modalOpen}
                        mode={modalMode}
                        initialValues={selectedAlert}
                        onClose={() => setModalOpen(false)}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                )}
            </Container>
        </AppShell>
    );
}