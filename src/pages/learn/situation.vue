<template>
  <view class="p-4 space-y-4 bg-[#f7f7f7] h-[93vh]">
    <!-- 顶部 Banner -->
    <view
      class="bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-2xl p-4 shadow-md relative"
    >
      <view class="text-sm opacity-80 absolute top-2 left-4">📅 {{ today }}</view>
      <view class="text-xl font-bold text-center mt-6">LifaBox 生活助手</view>
    </view>

    <!-- 信息卡片区域 -->
    <view class="flex gap-3">
      <!-- 学习次数卡片 -->
      <view class="flex-1 p-3 rounded-xl bg-white shadow" @click="goToLearnPage">
        <view class="text-sm text-gray-500">学习次数</view>
        <view class="text-lg font-bold text-indigo-600">{{ studyCount }}</view>
        <button
          class="btn mt-2 text-xs bg-indigo-100 text-indigo-600 rounded-full px-3 py-1"
          @click.stop="handleLearn"
        >
          学习情况
        </button>
      </view>

      <!-- 物品总数卡片 -->
      <view class="flex-1 p-3 rounded-xl bg-white shadow">
        <view class="text-sm text-gray-500">物品总数</view>
        <view class="text-lg font-bold text-purple-600">{{ itemTotal }}</view>
        <button
          class="btn mt-2 text-xs bg-purple-100 text-purple-700 rounded-full px-3 py-1"
          @click="viewItems"
        >
          查看物品
        </button>
      </view>
    </view>

    <!-- 学习打卡按钮 -->
    <!-- <view class="flex justify-center">
      <button class="bg-indigo-500 text-white px-4 py-2 rounded-full shadow" @tap="handleCheckIn">
        学习打卡
      </button>
    </view> -->

    <!-- 即将过期物品 -->
    <view class="bg-white p-4 rounded-xl shadow">
      <view class="font-bold text-md mb-2">即将过期物品</view>
      <view
        v-for="item in expiringItems"
        :key="item.name"
        class="flex justify-between items-center py-1"
      >
        <text>{{ item.name }}</text>
        <text class="text-red-500">{{ item.date }}</text>
      </view>
    </view>
    <!-- 庆祝动画组件 -->
    <CelebrationAnimation :show="showCelebration" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CelebrationAnimation from '@/components/CelebrationAnimation/index.vue'

const courseCheckin = uniCloud.importObject('course-checkin', {
  customUI: true,
})
const showCelebration = ref(false)
const today = new Date().toISOString().split('T')[0]
const studyCount = ref(0)
const itemTotal = ref(38)
const expiringItems = ref([
  { name: '牛奶', date: '2025-05-15' },
  { name: '鸡蛋', date: '2025-05-17' },
])

const getData = async () => {
  const res = await courseCheckin.getTotalCheckinCount()
  console.log('学习打卡次数:', res)
  studyCount.value = res?.data?.totalCheckinCount || 0
}

getData()

const goToLearnPage = () => {
  uni.navigateTo({ url: '/pages/learn/index' })
}

const viewItems = () => {
  uni.navigateTo({ url: '/pages/items/index' }) // 假设这是你的物品页路径
}

const handleLearn = () => {
  uni.navigateTo({ url: '/pages/learn/situation' })
}
</script>

<style scoped>
.btn:active {
  opacity: 0.8;
}
</style>
