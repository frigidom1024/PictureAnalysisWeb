from zhipuai import ZhipuAI
from config.api_config import APIConfig

class EmotionAnalyzer:
    def __init__(self):
        self.client = ZhipuAI(api_key=APIConfig.API_KEY)
    
    async def analyze_image(self, image_base64: str,prompt:str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=APIConfig.MODEL_NAME,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_base64
                                }
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ]
                    }
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"分析失败: {str(e)}")