<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '课程详情',
  },
}
</route>
<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '课程详情',
  },
}
</route>

<template>
  <view class="bg-gray-100 min-h-screen pb-6">
    <!-- 课程封面 -->
    <image
      class="w-full h-48 object-cover"
      src="https://cdn.uviewui.com/uview/album/1.jpg"
      mode="aspectFill"
    />

    <!-- 内容卡片 -->
    <view class="p-4 space-y-4 -mt-6">
      <view class="bg-white rounded-2xl shadow-md p-4 space-y-2">
        <view class="text-xl font-semibold text-gray-800">Vue3 从入门到精通</view>
        <view class="text-sm text-gray-500 leading-relaxed">
          本课程将带你全面掌握 Vue3，涵盖 Composition
          API、组件开发、状态管理等内容，适合零基础或有一定经验的前端开发者。
        </view>
      </view>

      <!-- 课程信息 -->
      <view
        class="bg-white rounded-2xl shadow-md p-4 grid grid-cols-3 gap-4 text-center text-sm text-gray-600"
      >
        <view>
          <view class="text-gray-900 font-semibold text-base">张老师</view>
          <view>讲师</view>
        </view>
        <view>
          <view class="text-gray-900 font-semibold text-base">12小时</view>
          <view>总时长</view>
        </view>
        <view>
          <view class="text-gray-900 font-semibold text-base">20</view>
          <view>章节数</view>
        </view>
      </view>

      <!-- 章节列表 -->
      <view class="bg-white rounded-2xl shadow-md p-4 space-y-2">
        <view class="font-semibold text-gray-800 text-base mb-2">课程章节</view>
        <view
          v-for="(chapter, index) in chapters"
          :key="index"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
        >
          <view class="text-gray-700">{{ index + 1 }}. {{ chapter.title }}</view>
          <text class="text-gray-400 text-sm">{{ chapter.duration }}</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="pt-4">
        <button
          class="w-full bg-indigo-500 text-white text-base py-3 rounded-2xl shadow-md"
          @click="startLearning"
        >
          立即学习
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from 'wot-design-uni'
const toast = useToast()

const chapters = [
  { title: '课程介绍与环境搭建', duration: '15分钟' },
  { title: '认识 Composition API', duration: '25分钟' },
  { title: 'Ref 与 Reactive 的使用', duration: '30分钟' },
  { title: '组件通信与 Props', duration: '20分钟' },
  { title: 'Pinia 状态管理实战', duration: '35分钟' },
  { title: '实战项目搭建', duration: '45分钟' },
]

function startLearning() {
  toast.show('课程学习功能暂未开启')
  // uni.navigateTo({ url: '/pages/courses/play?courseId=xxx' })
}
</script>
