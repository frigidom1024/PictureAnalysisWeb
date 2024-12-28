import { UploadConfig } from '../types/analysis';


export const maxHistory=10;

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
};

export const validateFile = (file: File, config: UploadConfig = DEFAULT_UPLOAD_CONFIG): string | null => {
  if (file.size > config.maxSize) {
    return `文件大小不能超过${config.maxSize / (1024 * 1024)}MB`;
  }
  
  if (!config.allowedTypes.includes(file.type)) {
    return `只支持 ${config.allowedTypes.join(', ')} 格式的图片`;
  }
  
  return null;
};