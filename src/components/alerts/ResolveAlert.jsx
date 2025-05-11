import { Modal, Text, Button, Group } from '@mantine/core';

export default function ResolveConfirmationModal({ opened, alert, onCancel, onConfirm }) {
    return (
        <Modal opened={opened} onClose={onCancel} title="Resolve Alert" centered>
            <Text>Are you sure you want to mark this alert as resolved? This action cannot be undone.</Text>
            <Text weight={500} mt="sm">{alert?.title}</Text>

            <Group position="right" mt="md">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button color="red" onClick={onConfirm}>Resolve</Button>
            </Group>
        </Modal>
    );
}