import os
from dotenv import load_dotenv

load_dotenv()

class APIConfig:
    # 智谱AI API配置
    API_KEY = os.getenv("ZHIPU_API_KEY")
    MODEL_NAME = "glm-4v-flash"

    # CORS配置
    CORS_ORIGINS = ["*"] 
    CORS_CREDENTIALS = True
    CORS_METHODS = ["*"]
    CORS_HEADERS = ["*"]

    PROMPT = "请分析这张图片中人物的情绪状态，包括表情、姿态等细节，给出详细的描述。终点分析人物当前的情感状态"