<script setup lang="ts">
// Vue 核心
import { ref,onBeforeUnmount } from 'vue'; // 添加生命周期钩子

// Element Plus UI 组件库
import { ElMessage } from 'element-plus'; // 用于显示消息提示

// 自定义 API 和工具函数
import { analyzeImage } from '../api/emotionAnalysis'; // 调用情绪分析 API 的方法
import { validateFile } from '../utils/file'; // 文件验证工具函数
import { readFileAsDataURL } from '../utils/image'; // 图片文件转换为 base64 的工具函数
import { API_MESSAGES } from '../api/config'; // API 相关的消息常量

// 类型定义
import type { ApiError } from '../types/analysis'; // API 错误类型定义
import type { AnalysisRecord } from '../types/analysis'; // 分析记录的类型定义

// 第三方库
import { v4 as uuidv4 } from 'uuid'; // 用于生成唯一标识符

// 响应式状态管理
const analysisPrompt = ref('');
const imageUrl = ref(''); // 存储上传图片的 URL
const analysis = ref(''); // 存储分析结果
const loading = ref(false); // 加载状态标识
const analysisHistory = ref<AnalysisRecord[]>([]); // 分析历史记录

const speaking = ref(false); // 是否正在朗读
const speechSynthesis = window.speechSynthesis;
let utterance: SpeechSynthesisUtterance | null = null;

// 处理图片上传
const handleImageUpload = async (event: Event) => {
  
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0];
  const validationError = validateFile(file);
  
  if (validationError) {
    ElMessage.warning(validationError);
    return;
  }

  try {
    imageUrl.value = await readFileAsDataURL(file);
  } catch (error) {
    ElMessage.error(API_MESSAGES.FILE_READ_ERROR);
  }
};

// 从 localStorage 加载历史记录
const loadHistory = () => {
  const savedHistory = localStorage.getItem('analysisHistory');
  if (savedHistory) {
    analysisHistory.value = JSON.parse(savedHistory);
  }
};

// 将分析结果保存到历史记录
const saveToHistory = (imageUrl: string, analysis: string) => {
  const record: AnalysisRecord = {
    id: uuidv4(), // 生成唯一ID
    imageUrl,
    analysis,
    timestamp: Date.now() // 记录当前时间戳
  };
  analysisHistory.value.unshift(record); // 将新记录添加到开头
  // 限制历史记录最多保存10条
  if (analysisHistory.value.length > 10) {
    analysisHistory.value = analysisHistory.value.slice(0, 10);
  }
  localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory.value));//持久化存储
};

// 执行图片分析
const analyzeEmotion = async () => {
  if (!imageUrl.value) {
    ElMessage.warning(API_MESSAGES.UPLOAD_REQUIRED);
    return;
  }

  loading.value = true;
  try {
    const result = await analyzeImage(imageUrl.value, analysisPrompt.value || '请帮我分析一下图片');
    analysis.value = result.analysis;
    saveToHistory(imageUrl.value, result.analysis);
    ElMessage.success(API_MESSAGES.ANALYSIS_SUCCESS);
  } catch (error) {
    const apiError = error as ApiError;
    ElMessage.error(apiError.message);
    console.error('Analysis error:', apiError);
  } finally {
    loading.value = false;
  }
};

// 添加朗读控制函数
const speak = () => {
  if (!analysis.value || speaking.value) return;
  
  speaking.value = true;
  utterance = new SpeechSynthesisUtterance(analysis.value);
  utterance.lang = 'zh-CN'; // 设置语言为中文
  
  utterance.onend = () => {
    speaking.value = false;
  };
  
  speechSynthesis.speak(utterance);
};

// 停止朗读
const stopSpeaking = () => {
  if (speaking.value) {
    speechSynthesis.cancel();
    speaking.value = false;
  }
};

// 组件卸载前清理
onBeforeUnmount(() => {
  stopSpeaking();
});

// 组件初始化时加载历史记录
loadHistory();
</script>

<template>
  <!-- 图片上传组件容器 -->
  <div class="image-uploader">
    <!-- 上传区域 -->
    <div class="upload-container">
      <input
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="file-input"
      />
      <div class="preview-area">
        <img v-if="imageUrl" :src="imageUrl" class="preview-image" alt="预览图片" />
        <div v-else class="upload-placeholder">
          点击或拖拽图片到此处
        </div>
      </div>
    </div>

    <!-- 在分析按钮前添加文本输入框 -->
    <el-input
      v-model="analysisPrompt"
      placeholder="请输入分析方向（可选）"
      class="analysis-prompt"
    />

    <!-- 分析按钮 -->
    <el-button
      type="primary"
      @click="analyzeEmotion"
      :loading="loading"
      :disabled="!imageUrl"
      class="analyze-btn"
    >
      分析图片
    </el-button>

    <!-- 分析结果显示区域 -->
    <div v-if="analysis" class="analysis-result">
      <div class="analysis-header">
        <h3>分析结果：</h3>
        <el-button
          :icon="speaking ? 'Mute' : 'VideoPlay'"
          :type="speaking ? 'danger' : 'primary'"
          size="small"
          @click="speaking ? stopSpeaking() : speak()"
          class="speak-button"
        >
          {{ speaking ? '停止朗读' : '朗读结果' }}
        </el-button>
      </div>
      <p>{{ analysis }}</p>
    </div>

    <!-- 历史记录显示区域 -->
    <div v-if="analysisHistory.length" class="history-section">
      <h3>历史记录</h3>
      <div v-for="record in analysisHistory" :key="record.id" class="history-item">
        <div class="history-image">
          <img :src="record.imageUrl" alt="历史图片" />
        </div>
        <div class="history-content">
          <p class="history-analysis">{{ record.analysis }}</p>
          <span class="history-time">{{ new Date(record.timestamp).toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 主容器样式 */
.image-uploader {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 上传区域样式 */
.upload-container {
  position: relative;
  width: 100%;
  height: 300px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.preview-area {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-placeholder {
  color: #909399;
  font-size: 16px;
}

.analyze-btn {
  width: 100%;
  margin: 20px 0;
}

.analysis-result {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.analysis-result h3 {
  margin-top: 0;
  color: #303133;
}

.analysis-result p {
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
}

.history-section {
  margin-top: 30px;
}

.history-item {
  display: flex;
  gap: 20px;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
}

.history-image {
  width: 100px;
  height: 100px;
}

.history-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.history-content {
  flex: 1;
}

.history-analysis {
  margin: 0 0 10px;
  color: #606266;
}

.history-time {
  color: #909399;
  font-size: 12px;
}

/* 添加输入框样式 */
.analysis-prompt {
  margin-bottom: 15px;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.speak-button {
  margin-left: 10px;
}
</style>