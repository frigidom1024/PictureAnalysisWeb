export interface AnalysisResponse {
  analysis: string;
}

export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

export interface AnalysisRecord {
  id: string;
  imageUrl: string;
  analysis: string;
  timestamp: number;
}