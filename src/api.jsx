// api.jsx

import axios from 'axios';

const BASE_URL = 'http://140.99.97.148:3001';

const BASE_URL_MASTER = `${BASE_URL}/plantlist/master`;
const BASE_URL_DATA = `${BASE_URL}/plantList/PlantData`;
const BASE_URL_DATAALL = `${BASE_URL}/results/summaryAllDiv`;

const fetchData = async (url, params) => {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

export const fetchPlantData = (DivNo, DeptNo, SectNo, StartDate, EndDate) => fetchData(BASE_URL_DATA, { DivNo, DeptNo, SectNo, StartDate, EndDate });
export const fetchSearchData = (DivNo, DeptNo) => fetchData(BASE_URL_MASTER, { DivNo, DeptNo });
export const fetchSummaryAllDiv = (params) => fetchData(BASE_URL_DATAALL, params);
