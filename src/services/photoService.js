import axios from "axios";
import {ALERT_URL} from "../constants/index.js";

export async function savePhotosToS3(photoUrls, photoFiles) {
    if (!photoUrls || !photoFiles.length) return;

    const photosToUpload = photoUrls.map(({ s3ObjectKey, presignedUrl }) =>{

        const filename = s3ObjectKey.split("__")[0];
        const extension = s3ObjectKey.substring(s3ObjectKey.lastIndexOf('.') + 1);


        const file = photoFiles.find(file => file.name === `${filename}.${extension}`);
        return {file, presignedUrl}
    })

    await Promise.all(
        photosToUpload.map(({file, presignedUrl}) =>
            fetch(presignedUrl, {
                method: 'PUT',
                headers: {'Content-Type': file.type},
                body: file,
            })
        )
    );
}

export async function getPresignedUrlsForNewPhotos (alertId, photoFilenames) {
    const endpoint = `${ALERT_URL}/${alertId}/photos`;
    try {
        const response = await axios.post(endpoint, {photoFilenames: photoFilenames});
        return response.data;
    } catch (error) {
        console.log('Error getting presigned urls for new photos', error);
        throw error;
    }
}