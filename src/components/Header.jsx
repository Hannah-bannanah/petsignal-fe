import { Title, Group, Button } from '@mantine/core';

export default function Header({ onNewAlert }) {
    return (
        <Group position="apart" mb="md">
            <Title order={2}>🐾 Alerts</Title>
            <Button onClick={onNewAlert}>+ New Alert</Button>
        </Group>
    );
}