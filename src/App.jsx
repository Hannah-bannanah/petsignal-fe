import {useEffect, useState} from 'react';
import {AppShell, Container, Divider, Paper} from '@mantine/core';
import Header from './components/Header';
import AlertList from './components/AlertList';
import AlertDetail from './components/AlertDetail';
import * as alertService from "./services/alertService.js";
import {toAlert, toForm} from "./mappers/alertMapper.js";


export default function App() {
    const [alerts, setAlerts] = useState([]); // This should be fetched from your API
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'create'
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const data = await alertService.getAlerts();
                setAlerts(data.content); // Assuming response has a "content" property
            } catch (error) {
                console.error('Failed to fetch alerts:', error);
            }
        };
        fetchAlerts();
    }, []);

    const openModal = (mode, alert = null) => {
        setModalMode(mode);
        setSelectedAlert(alert ? toForm(alert) : null);
        setModalOpen(true);
    };


    const handleSubmit = async (formAlert) => {
        const alert = toAlert(formAlert);
        try {
            if (modalMode === 'create') {
                const createdAlert = await alertService.createAlert(alert);
                setAlerts([...alerts, createdAlert]); // Add new alert to the list
            } else if (modalMode === 'edit') {
                const updatedAlert = await alertService.updateAlert(alert.id, alert);
                setAlerts(alerts.map(a => (a.id === alert.id ? updatedAlert : a))); // Update the alert in state
            }
            setModalOpen(false);
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    };

    const handleCancel = () => {
        setModalOpen(false); // Close modal without saving
    };

    const handleDelete = async (alertId) => {
        try {
            await alertService.deleteAlert(alertId);
            setAlerts(alerts.filter(alert => alert.id !== alertId)); // Remove deleted alert from state
        } catch (error) {
            console.error('Error deleting alert:', error);
        }
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
                        readOnly={modalMode === 'view'}
                        initialValues={selectedAlert}
                        onClose={() => setModalOpen(false)}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        onDelete={handleDelete}
                    />
                )}
            </Container>
        </AppShell>
    );
}