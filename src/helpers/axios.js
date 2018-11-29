import axiosOrigin from 'axios';

export const axios = axiosOrigin.create({
    baseURL: 'http://localhost:9002/index.php/api/'
});

export const API_URL = 'http://localhost:9002/index.php/api';

