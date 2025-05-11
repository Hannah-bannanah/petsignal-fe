import axios from 'axios';
import {getPresignedUrlsForNewPhotos, savePhotosToS3} from "./photoService.js";

const ALERT_URL = 'http://localhost:8080/api/v1/alerts';

export const getAlerts = async () => {
    try {
        const response = await axios.get(ALERT_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
    }
};

export const getAlertById = async (id) => {
    try {
        const response = await axios.get(ALERT_URL + "/" + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching alert with id' + id + ":", error);
        throw error;
    }
}

const saveAlertInDatabase = async (alertData) => {
    try {
        const response = await axios.post(ALERT_URL, {...alertData, status: 'ACTIVE'});
        return response.data;
    } catch (error) {
        console.error('Error creating alert:', error);
        throw error;
    }
};

// async function savePhotosToS3(photoUrls, photoFiles) {
//     if (!photoUrls || !photoFiles.length) return;
//
//     const photosToUpload = photoUrls.map(({ s3ObjectKey, presignedUrl }) =>{
//
//         const filename = s3ObjectKey.split("__")[0];
//         const extension = s3ObjectKey.substring(s3ObjectKey.lastIndexOf('.') + 1);
//
//
//         const file = photoFiles.find(file => file.name === `${filename}.${extension}`);
//         return {file, presignedUrl}
//     })
//
//     await Promise.all(
//         photosToUpload.map(({file, presignedUrl}) =>
//             fetch(presignedUrl, {
//                 method: 'PUT',
//                 headers: {'Content-Type': file.type},
//                 body: file,
//             })
//         )
//     );
// }

export async function createAlert(alert, photoFiles) {
    // save alert in DB
    const savedAlert = await saveAlertInDatabase(alert);
    // if alert includes photos, save to s3 and retrieve saved alert with GET presigned urls
    if (savedAlert.photoUrls && photoFiles.length) {
        // save photos
        await savePhotosToS3(savedAlert.photoUrls, photoFiles);
        return await getAlertById(savedAlert.id);
    }

    return savedAlert;
}

const updateAlertData = async (alertId, alertData) => {
    try {
        const response = await axios.put(`${ALERT_URL}/${alertId}`, alertData);
        return response.data;
    } catch (error) {
        console.error('Error updating alert:', error);
        throw error;
    }
};

// const getPresignedUrlsForNewPhotos = async (alertId, photoFilenames) => {
//     const endpoint = `${ALERT_URL}/${alertId}/photos`;
//     try {
//         const response = await axios.post(endpoint, {photoFilenames: photoFilenames});
//         return response.data;
//     } catch (error) {
//         console.log('Error getting presigned urls for new photos', error);
//         throw error;
//     }
// }

export async function updateAlert(alertId, alertData, photoFiles) {
    // save alert in DB
    const updatedAlert = await updateAlertData(alertId, alertData);
    // if alert includes photos, save to s3 and retrieve saved alert with GET presigned urls
    if (photoFiles?.length) {
        // get presigned urls for added photos and save them
        const presignedUrls = await getPresignedUrlsForNewPhotos(alertId, photoFiles.map(f => f.name));
        await savePhotosToS3(presignedUrls, photoFiles);
        return await getAlertById(updatedAlert.id);
    }

    return updatedAlert;
}

export const deleteAlert = async (alertId) => {
    try {
        await axios.delete(`${ALERT_URL}/${alertId}`);
        return alertId;  // Return the ID of the deleted alert (useful for removing it from state)
    } catch (error) {
        console.error('Error deleting alert:', error);
        throw error;
    }
};