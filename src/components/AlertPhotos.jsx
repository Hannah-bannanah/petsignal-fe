import {Image, SimpleGrid, Text, Paper} from '@mantine/core';

export default function AlertPhotos({photos}) {
    if (!photos || photos.length === 0) return null;

    return (
        <Paper withBorder p="md" mt="md">
            <Text weight={500} mb="sm">Photos</Text>
            <SimpleGrid cols={3} spacing="sm">
                {photos.map(photo => (
                    <Image
                        key={photo.s3ObjectKey}
                        src={photo.presignedUrl}
                        alt={photo.s3ObjectKey}
                        radius="sm"
                        fallbackSrc="/logo.png"
                    />
                ))}
            </SimpleGrid>
        </Paper>
    );
}