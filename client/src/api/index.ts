import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://project2-454000.wl.r.appspot.com';

export const analyzeImage = async (imageUrl: string) => {
    try {
        const response = await axios.post(`${API_URL}/vision`, { imageUrl });
        console.log("Server Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error during API call:", error);
        if (error.response) {
            console.error("Server responded with:", error.response.data);
            return { error: error.response.data };
        } else if (error.request) {
            console.error("No response received from server.");
            return { error: "No response from server" };
        } else {
            console.error("Error setting up request:", error.message);
            return { error: error.message };
        }
    }
};


export const generateStory = async (userPrompt: string) => {
    try {
        const response = await axios.post(`${API_URL}/gemini`, { userPrompt });
        console.log("Story Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error during story generation:", error);
        if (error.response) {
            console.error("Server responded with:", error.response.data);
            return { error: error.response.data };
        } else if (error.request) {
            console.error("No response received from server.");
            return { error: "No response from server" };
        } else {
            console.error("Error setting up request:", error.message);
            return { error: error.message };
        }
    }
};
