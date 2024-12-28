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

3. 配置智谱API Key

   1.https://open.bigmodel.cn/ 在官网注册并创建API key;

   2.在该项目的backend创建一个 .env  文件。并添加一下内容    
      **ZHIPU_API_KEY= "你的API key"**

4. 启动前端服务：
   ```bash
   npm run dev
   ```

5. 启动后端服务：
   ```bash
   python backend/main.py
   ```

# 注意事项
   \src\utils\file.ts 中配置了上传数据的限制和历史记录长度
   ```
   export const maxHistory=10;//历史记录长度

   export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
   };
   ```



