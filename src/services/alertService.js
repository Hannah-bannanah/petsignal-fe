import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/alerts';

export const getAlerts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
    }
};

export const createAlert = async (alertData) => {
    console.log('creating ...')
    try {
        const response = await axios.post(API_URL, {...alertData, status:'ACTIVE'});
        console.log('response', response)
        return response.data;
    } catch (error) {
        console.error('Error creating alert:', error);
        throw error;
    }
};

export const updateAlert = async (alertId, alertData) => {
    try {
        const response = await axios.put(`${API_URL}/${alertId}`, alertData);
        return response.data;
    } catch (error) {
        console.error('Error updating alert:', error);
        throw error;
    }
};

export const deleteAlert = async (alertId) => {
    try {
        await axios.delete(`${API_URL}/${alertId}`);
        return alertId;  // Return the ID of the deleted alert (useful for removing it from state)
    } catch (error) {
        console.error('Error deleting alert:', error);
        throw error;
    }
};