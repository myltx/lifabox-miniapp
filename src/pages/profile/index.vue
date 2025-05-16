<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>
<template>
  <view class="p-4 space-y-4 bg-gray-100 min-h-screen">
    <!-- 用户信息区域 -->
    <view class="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4">
      <image
        class="w-16 h-16 rounded-full"
        src="https://cdn.uviewui.com/uview/album/1.jpg"
        mode="aspectFill"
      />
      <view class="ml-[10px]">
        <view class="text-lg font-semibold text-gray-800">张三</view>
        <view class="text-sm text-gray-500">欢迎回来 👋</view>
      </view>
    </view>

    <!-- 功能区块 -->
    <view class="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
      <view
        v-for="(item, index) in menuList"
        :key="index"
        class="flex items-center justify-between p-4"
        @click="goTo(item.path)"
      >
        <view class="flex items-center space-x-3">
          <text :class="`text-xl ${item.color}`">{{ item.icon }}</text>
          <text class="text-gray-800 text-base">{{ item.title }}</text>
        </view>
        <text class="text-gray-400 text-lg">›</text>
      </view>
    </view>

    <!-- 底部版权信息 -->
    <view class="text-center text-xs text-gray-400 mt-8">© 2025 LifaBox · 生活助手</view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from 'wot-design-uni'
const toast = useToast()
const menuList = [
  {
    title: '我的收藏',
    icon: '❤️',
    color: 'text-pink-500',
    path: '/pages/favorites/index',
  },
  {
    title: '设置',
    icon: '⚙️',
    color: 'text-blue-500',
    path: '/pages/settings/index',
  },
  {
    title: '意见反馈',
    icon: '📝',
    color: 'text-green-500',
    path: '/pages/feedback/index',
  },
  {
    title: '关于我们',
    icon: 'ℹ️',
    color: 'text-purple-500',
    path: '/pages/about/index',
  },
]

function goTo(path: string) {
  toast.show('功能开发中,敬请期待')
  //   uni.navigateTo({ url: path })
}
</script>

<style scoped></style>
