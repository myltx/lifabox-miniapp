<template>
  <view class="p-4 space-y-4 bg-gray-100 min-h-screen">
    <!-- Banner -->
    <view
      class="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
    >
      LifaBox 生活助手
    </view>
    <ContributionCalendar />

    <!-- 信息卡片区（打卡 + 物品 + 日期天气） -->
    <view class="grid grid-cols-2 gap-4">
      <!-- 打卡次数 + 进入打卡 -->
      <view
        class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between"
        @click="goTo('learn')"
      >
        <text class="text-gray-500 text-sm">学习次数</text>
        <view class="text-2xl font-bold text-indigo-600 mt-1">12</view>
        <view class="mt-2 bg-indigo-100 text-indigo-600 text-xs rounded-full px-3 py-1">
          进入学习
        </view>
      </view>

      <!-- 总物品数量 + 进入物品列表 -->
      <view
        class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between"
        @click="goTo('items')"
      >
        <text class="text-gray-500 text-sm">物品总数</text>
        <view class="text-2xl font-bold text-purple-600 mt-1">38</view>
        <view class="mt-2 bg-purple-100 text-purple-600 text-xs rounded-full px-3 py-1">
          查看物品
        </view>
      </view>

      <!-- 当前日期 -->
      <view
        class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between"
        @click="onPunchSuccess"
      >
        <text class="text-gray-500 text-sm">当前日期</text>
        <view class="text-xl font-semibold text-gray-700 mt-1">2025-05-14</view>
      </view>

      <!-- 天气信息 -->
      <view class="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between">
        <text class="text-gray-500 text-sm">今日天气</text>
        <view class="text-xl font-semibold text-gray-700 mt-1">晴 · 22°C</view>
      </view>
    </view>

    <!-- 即将过期物品列表 -->
    <view class="bg-white rounded-2xl shadow-md p-4">
      <view class="text-base font-semibold text-gray-800 mb-3">即将过期物品</view>
      <view
        v-for="item in expireSoonItems"
        :key="item.id"
        class="flex justify-between py-2 border-b border-gray-100"
      >
        <text class="text-gray-700">{{ item.name }}</text>
        <text class="text-sm text-red-500">{{ item.expireDate }}</text>
      </view>
    </view>
    <Fireworks ref="fireworksRef" />
  </view>
</template>

<script setup lang="ts">
import Fireworks from '@/components/Fireworks/index.vue'
import ContributionCalendar from '@/components/ContributionCalendar/index.vue'
const fireworksRef = ref<InstanceType<typeof Fireworks>>()
const expireSoonItems = [
  { id: 1, name: '牛奶', expireDate: '2025-05-15' },
  { id: 2, name: '鸡蛋', expireDate: '2025-05-17' },
]

function goTo(page: string) {
  uni.navigateTo({ url: `/pages/${page}/index` })
}

const onPunchSuccess = () => {
  fireworksRef.value?.startFireworks() // 播放 3 秒
}
</script>

<style scoped></style>
