import axios from 'axios';
import {getPresignedUrlsForNewPhotos, savePhotosToS3} from "./photoService.js";
import {ALERT_STATUS, ALERT_URL} from "../constants/index.js";

export const getAlerts = async () => {
    try {
        const params = `status=${ALERT_STATUS.ACTIVE}`
        const response = await axios.get(`${ALERT_URL}?${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
    }
};

export const getAlertById = async (id) => {
    try {
        const response = await axios.get(`${ALERT_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching alert with id' + id + ":", error);
        throw error;
    }
}

const saveAlertInDatabase = async (alertData) => {
    try {
        const response = await axios.post(ALERT_URL, {...alertData, status: ALERT_STATUS.ACTIVE});
        return response.data;
    } catch (error) {
        console.error('Error creating alert:', error);
        throw error;
    }
};

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