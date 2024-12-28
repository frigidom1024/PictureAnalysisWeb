from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from config.api_config import APIConfig
from services.emotion_analyzer import EmotionAnalyzer

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=APIConfig.CORS_ORIGINS,
    allow_credentials=APIConfig.CORS_CREDENTIALS,
    allow_methods=APIConfig.CORS_METHODS,
    allow_headers=APIConfig.CORS_HEADERS,
)

class ImageRequest(BaseModel):
    image: str  # base64编码的图片
    prompt: str  # 分析方向
@app.post("/analyze")
async def analyze_emotion(request: ImageRequest):
    try:
        # 从base64字符串中提取实际的图片数据
        image_data = request.image.split(",")[1] if "," in request.image else request.image
        
        analyzer = EmotionAnalyzer()

        result = await analyzer.analyze_image(image_data,request.prompt)
        
        return {"analysis": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)