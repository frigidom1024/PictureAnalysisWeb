export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    ANALYZE: '/analyze'
  },
  TIMEOUT: 30000 // 30 seconds
};

export const API_MESSAGES = {
  UPLOAD_REQUIRED: '请先上传图片',
  ANALYSIS_SUCCESS: '分析完成',
  ANALYSIS_FAILED: '分析失败，请重试',
  NETWORK_ERROR: '网络连接失败，请检查后端服务是否正常运行',
  VALIDATION_ERROR: '请求验证失败',
  SERVER_ERROR: '服务器错误',
  TIMEOUT_ERROR: '请求超时，请重试',
  FILE_READ_ERROR: '文件读取失败'
};