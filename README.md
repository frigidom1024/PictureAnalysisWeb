# 关于
这是一个简易的在线图片分析网站，前端使用 Vite 和 Vue，后端使用 Python 调用智谱的 GLM-4V-Flash 模型进行分析并返回结果。

# 功能
1. 上传图片并提供提示词让AI返回图片分析结果
2. 分析结果支持语言播放
3. 支持简单的历史记录（默认10条）

# 使用步骤
1. 安装前端依赖：
   ```bash
   npm install vue@next element-plus uuid
   ```

2. 安装后端依赖：
   ```bash
   pip install fastapi
   pip install uvicorn
   pip install pydantic
   ```

3. 配置智谱api


4. 启动前端服务：
   ```bash
   npm run dev
   ```

5. 启动后端服务：
   ```bash
   python backend/main.py
   ```






