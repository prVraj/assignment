import axios from 'axios';

const BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number = 1, limit: number = 10) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                page: page,
                limit: limit,
                fields: 'title,place_of_origin,artist_display,inscriptions,date_start,date_end',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching artworks:', error);
        return null;
    }
};
