import {useEffect, useState} from 'react';
import {AppShell, Container, Divider, Paper} from '@mantine/core';
import Header from './components/Header';
import AlertList from './components/alerts/AlertList.jsx';
import AlertDetail from './components/alerts/AlertDetail.jsx';
import * as alertService from "./services/alertService.js";
import {toAlert, toForm} from "./mappers/alertMapper.js";


export default function App() {
    const [alerts, setAlerts] = useState([]); // This should be fetched from your API
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'view' | 'edit' | 'create'
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);

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
        setSelectedFiles([]);
        setModalOpen(true);
    };


    const handleSubmit = async (formAlert) => {
        const alert = toAlert(formAlert);
        if (selectedFiles.length) {
            alert.photoFilenames = selectedFiles.map((f) => f.name);
        }
        try {
            if (modalMode === 'create') {
                const createdAlert = await alertService.createAlert(alert, selectedFiles);
                setAlerts([...alerts, createdAlert]);
            } else if (modalMode === 'edit') {
                const updatedAlert = await alertService.updateAlert(alert.id, alert, selectedFiles);
                setAlerts(alerts.map(a => (a.id === alert.id ? updatedAlert : a)));
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
                        setSelectedFiles={setSelectedFiles}
                    />
                )}
            </Container>
        </AppShell>
    );
}