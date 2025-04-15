import axios from 'axios';

const PIXABAY_API_KEY = process.env.NEXT_PUBLIC_PIXABAY_API_KEY;
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';


export interface PixabayImage {
    id: number;
    webformatURL: string;
    largeImageURL: string;
    user: string;
    tags: string;
    imageWidth: number;
    imageHeight: number;
}

interface PixabayResponse {
    total: number;
    totalHits: number;
    hits: PixabayImage[];
}

/**
 * Searches for images on Pixabay based on a query string.
 * @param query - The search term for images.
 * @param perPage - Number of results per page (default: 20).
 * @returns A promise resolving to an array of PixabayImage objects.
 * @throws Error if the API key is missing, query is invalid, or request fails.
 * 
 */
export const searchImages = async (query: string, perPage: number = 20): Promise<PixabayImage[]> => {

    if (!PIXABAY_API_KEY) {
        throw new Error('Pixabay API key is not configured');
    }


    if (!query?.trim()) {
        throw new Error('Search query cannot be empty');
    }

    try {
        const response = await axios.get<PixabayResponse>(PIXABAY_BASE_URL, {
            params: {
                key: PIXABAY_API_KEY,
                q: query.trim(),
                image_type: 'photo',
                per_page: Math.max(3, Math.min(perPage, 200)),
                safesearch: true,
            },
            timeout: 10000,
        });


        if (!response.data?.hits) {
            throw new Error('Invalid response from Pixabay API');
        }

        return response.data.hits;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 429) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            if (error.response?.status === 400) {
                throw new Error('Invalid search query. Please check your input.');
            }
            throw new Error(`API request failed: ${error.message}`);
        }

        console.error('Error fetching images from Pixabay:', error);
        throw new Error('Failed to fetch images. Please try again later.');
    }
};