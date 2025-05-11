import React from 'react';
import {Badge, Button, Card, Group, SimpleGrid, Stack, Text} from '@mantine/core';

export default function AlertList({alerts, onViewDetail, onEdit, onResolve, onDelete}) {
    return (
        <SimpleGrid cols={{base: 1, sm: 2, md: 3}} spacing="lg" mt="md">
            {alerts.map((alert) => (
                <Card key={alert.id} shadow="sm" padding="lg" radius="md" withBorder>
                    <Group position="apart" mb="xs">
                        <Text fw={700} size="lg">{alert.title}</Text>
                        <Badge color={alert.type === 'LOST' ? 'red' : 'green'} variant="light">
                            {alert.type}
                        </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mb="xs">
                        {alert.description.length > 100 ? alert.description.slice(0, 100) + '...' : alert.description}
                    </Text>

                    <Stack gap={4} mb="sm">
                        <Text size="sm"><strong>Date:</strong> {new Date(alert.date).toLocaleDateString()}</Text>
                        <Text size="sm"><strong>Breed:</strong> {alert.breed}</Text>
                        <Text size="sm">
                            <strong>Location:</strong> {alert.postalCode}, {alert.countryCode}
                        </Text>
                    </Stack>

                    <Group position="right" mt="md">
                        <Button size="xs" onClick={() => onViewDetail(alert)}>View Detail</Button>
                        <Button size="xs" variant="light" onClick={() => onEdit(alert)}>Edit</Button>
                        <Button size="xs" color="yellow" variant="light" onClick={() => onResolve(alert)}>Resolve</Button>
                        <Button size="xs" color="red" variant="light" onClick={() => onDelete(alert.id)}>Delete</Button>
                    </Group>
                </Card>
            ))}
        </SimpleGrid>
    );
};