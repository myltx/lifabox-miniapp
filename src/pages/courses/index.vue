<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '课程列表',
  },
}
</route>

<template>
  <view class="p-4 space-y-4 bg-[#f7f7f7] h-[93vh]">
    <!-- 顶部标题 -->
    <view
      class="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-2xl p-4 shadow-md"
    >
      <view class="text-sm opacity-80">📚 我的学习</view>
      <view class="text-xl font-bold mt-2 text-center">课程列表</view>
    </view>

    <!-- 课程列表 -->
    <view class="space-y-3">
      <view
        v-for="course in courses"
        :key="course.id"
        class="bg-white rounded-xl shadow p-4 space-y-2"
      >
        <view class="text-base font-bold text-indigo-700">
          {{ course.title }}
        </view>
        <view class="text-sm text-gray-500">
          {{ course.description }}
        </view>

        <!-- 学习进度条 -->
        <view class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <view class="h-2 bg-indigo-500" :style="{ width: course.progress + '%' }"></view>
        </view>
        <view class="text-xs text-gray-400 text-right">学习进度 {{ course.progress }}%</view>

        <!-- 操作按钮 -->
        <view class="flex justify-end">
          <button
            class="bg-indigo-500 text-white rounded-full px-4 py-1 text-sm shadow"
            @tap="goToCourse(course.id)"
          >
            进入课程
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const courses = ref([
  {
    id: 1,
    title: 'Vue3 入门教程',
    description: '适合初学者快速上手 Vue3 开发。',
    progress: 60,
  },
  {
    id: 2,
    title: 'UniApp 实战课程',
    description: '通过实战项目掌握 UniApp 开发技巧。',
    progress: 35,
  },
  {
    id: 3,
    title: '前端性能优化指南',
    description: '掌握前端性能优化的关键技术与工具。',
    progress: 80,
  },
])

const goToCourse = (id: number) => {
  uni.navigateTo({ url: `/pages/courses/detail?id=${id}` })
}
</script>
