import axios, { AxiosError } from 'axios';
import { API_CONFIG, API_MESSAGES } from './config';
import { AnalysisResponse, ApiError } from '../types/analysis';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const analyzeImage = async (imageData: string, prompt: string): Promise<AnalysisResponse> => {
  try {
    const response = await api.post(API_CONFIG.ENDPOINTS.ANALYZE,{
      image: imageData,
      prompt:prompt
    });
    return response.data;
  } catch (error) {
    let apiError: ApiError;
    
    if (error instanceof AxiosError) {
      if (error.code === 'ECONNABORTED') {
        apiError = { message: API_MESSAGES.TIMEOUT_ERROR };
      } else if (!error.response) {
        apiError = { message: API_MESSAGES.NETWORK_ERROR };
      } else {
        apiError = {
          message: error.response.data?.detail || API_MESSAGES.SERVER_ERROR,
          code: error.response.status.toString()
        };
      }
    } else {
      apiError = { message: API_MESSAGES.ANALYSIS_FAILED };
    }
    
    throw apiError;
  }
};