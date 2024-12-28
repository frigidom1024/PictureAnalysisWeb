<script setup lang="ts">
import ImageUploader from './components/ImageUploader.vue'
</script>

<template>
  <div class="app-container">
    <h1>图片分析系统</h1>
    <p class="description">上传图片，AI将分析</p>
    <ImageUploader />
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
}

h1 {
  color: #303133;
  margin-bottom: 20px;
}

.description {
  color: #606266;
  margin-bottom: 40px;
}
</style>