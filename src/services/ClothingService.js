import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/clothings';

export const getAllClothings = async (params = {}) => {
    try {
        const response = await axios.get(API_BASE_URL, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching clothings:', error);
        return [];
    }
};

export const getAllTypes = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/types`);
        return response.data;
    } catch (error) {
        console.error('Error fetching types:', error);
        return [];
    }
};

export const createClothing = async (clothingData) => {
    try {
        const response = await axios.post(API_BASE_URL, clothingData);
        return response.data;
    } catch (error) {
        console.error('Error creating clothing:', error);
    }
};

export const getClothingById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching clothing by id:', error);
    }
};

export const updateClothing = async (id, clothingData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/${id}`, clothingData);
        return response.data;
    } catch (error) {
        console.error('Error updating clothing:', error);
    }
};

export const deleteClothing = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/${id}`);
    } catch (error) {
        console.error('Error deleting clothing:', error);
    }
};
