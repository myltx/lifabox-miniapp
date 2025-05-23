<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '物品分类',
  },
}
</route>

<template>
  <view class="p-4 bg-gray-100 min-h-screen space-y-4">
    <!-- 分类卡片列表 -->
    <view
      v-for="(item, index) in categories"
      :key="index"
      class="bg-white p-4 rounded-2xl shadow-md flex items-start justify-between"
    >
      <view>
        <view class="text-lg font-semibold text-gray-800">{{ item.name }}</view>
        <view class="text-sm text-gray-500 mt-1">{{ item.description }}</view>
      </view>
      <text class="text-2xl text-gray-300">›</text>
    </view>

    <!-- 新增按钮 -->
    <button
      class="w-full bg-indigo-500 text-white text-base py-3 rounded-2xl shadow-md mt-6"
      @click="goToCreate"
    >
      新增分类
    </button>
  </view>
</template>

<script setup lang="ts">
const categories = [
  { name: '书籍', description: '包括纸质书、电子书、杂志等' },
  { name: '电子产品', description: '手机、平板、电脑等设备' },
  { name: '日用品', description: '生活中常用的物品，如洗漱用品' },
]

function goToCreate() {
  uni.navigateTo({ url: '/pages/item-categories/edit' })
}
</script>
