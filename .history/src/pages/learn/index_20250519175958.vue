<template>
  <view class="p-4 space-y-4">
    <!-- 今日任务提醒 -->
    <view class="bg-blue-100 text-blue-800 rounded-xl p-4 shadow-sm">
      <view class="text-sm">今日任务</view>
      <view class="text-lg font-bold mt-1">{{ todayPlan.title || '暂无任务' }}</view>
      <view class="text-xs text-gray-500 mt-1">{{ todayPlan.description }}</view>
    </view>

    <!-- 学习计划列表 -->
    <view class="bg-white rounded-xl p-4 shadow mt-4">
      <view class="font-bold mb-2">📚 学习计划</view>
      <view
        v-for="plan in learningPlans"
        :key="plan.id"
        class="p-3 rounded-lg bg-gray-50 mb-2 flex justify-between items-center"
        @click="goToPlan(plan.id)"
      >
        <view>
          <view class="text-md font-bold">{{ plan.title }}</view>
          <view class="text-xs text-gray-500">{{ plan.description }}</view>
        </view>
        <view class="text-sm text-green-600">{{ plan.progress }}%</view>
      </view>
    </view>

    <!-- 打卡按钮 -->
    <view class="mt-4">
      <button
        class="bg-indigo-500 text-white text-sm py-2 px-4 rounded-full w-full shadow"
        @click="handleCheckIn"
      >
        打卡完成今日学习 ✅
      </button>
    </view>

    <!-- 学习记录 -->
    <view class="bg-white p-4 rounded-xl shadow mt-4">
      <view class="font-bold text-md mb-2">🕒 学习记录</view>
      <view v-for="record in recentRecords" :key="record.date" class="flex justify-between py-1">
        <text>{{ record.date }}</text>
        <text class="text-green-600">{{ record.planTitle }}</text>
      </view>
    </view>

    <!-- 庆祝动画 -->
    <!-- <CelebrationAnimation :show="showCelebration" /> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import CelebrationAnimation from '@/components/CelebrationAnimation/index.vue'

const today = new Date().toISOString().split('T')[0]

const todayPlan = ref({
  title: '背单词',
  description: '今日目标：记忆10个新单词并复习昨日内容',
})

const learningPlans = ref([
  { id: 1, title: '英语词汇计划', description: '每天10个新单词', progress: 60 },
  { id: 2, title: '前端知识整理', description: '每日阅读 30 分钟', progress: 80 },
])

const recentRecords = ref([
  { date: '2025-05-18', planTitle: '英语词汇计划' },
  { date: '2025-05-17', planTitle: '前端知识整理' },
])

const showCelebration = ref(false)

const handleCheckIn = () => {
  uni.showToast({ title: '🎉 学习打卡成功！', icon: 'none' })
  showCelebration.value = true
  setTimeout(() => (showCelebration.value = false), 3000)
}

const goToPlan = (id: number) => {
  uni.navigateTo({ url: `/pages/learn/detail?id=${id}` })
}
</script>

<style scoped>
button:active {
  opacity: 0.8;
}
</style>
