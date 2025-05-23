<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '关于我们',
  },
}
</route>

<template>
  <view class="p-4 bg-gray-100 min-h-screen space-y-4">
    <view class="bg-white rounded-2xl shadow-md p-6 space-y-4 text-gray-800">
      <view class="text-2xl font-bold text-center">关于 LifaBox</view>
      <view class="text-base leading-relaxed text-gray-600">
        LifaBox
        是一个专注于生活效率与知识整理的个人助理应用。我们致力于通过简洁、实用的工具帮助用户高效记录和管理日常学习与物品信息，让生活更有条理。
      </view>
      <view class="text-base leading-relaxed text-gray-600">
        本项目由个人开发者独立维护，欢迎提出宝贵建议与反馈。如有合作意向，也欢迎联系作者。
      </view>
    </view>

    <view class="bg-white rounded-2xl shadow-md p-6 space-y-2 text-gray-600 text-sm">
      <view>版本号：v1.0.0</view>
      <view>更新时间：2025年5月</view>
      <view>开发者：小马同学</view>
      <view>邮箱：865147643@qq.com</view>
    </view>

    <view class="text-center text-xs text-gray-400 mt-10">© 2025 LifaBox · 用心打造生活助手</view>
  </view>
</template>

<script setup lang="ts">
// 暂无逻辑，仅展示静态内容
</script>

<style scoped></style>
