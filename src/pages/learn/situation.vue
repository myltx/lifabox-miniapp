<template>
  <view class="p-4 space-y-4 bg-[#f7f7f7] h-[93vh]">
    <!-- 标题 Banner -->
    <view
      class="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white rounded-2xl p-4 shadow-md"
    >
      <view class="text-sm opacity-80">📊 学习情况一览</view>
      <view class="text-xl font-bold mt-2 text-center">学习记录统计</view>
    </view>

    <!-- 数据卡片区域 -->
    <view class="flex gap-3">
      <!-- 累计打卡 -->
      <view class="flex-1 p-3 rounded-xl bg-white shadow">
        <view class="text-sm text-gray-500">累计打卡</view>
        <view class="text-lg font-bold text-indigo-600">{{ totalCount }}</view>
      </view>

      <!-- 最近打卡日期 -->
      <view class="flex-1 p-3 rounded-xl bg-white shadow">
        <view class="text-sm text-gray-500">最近打卡</view>
        <view class="text-lg font-bold text-indigo-600">{{ latestCheckin || '无记录' }}</view>
      </view>
    </view>

    <!-- 柱状图区域 -->
    <view class="bg-white p-3 rounded-xl shadow">
      <view class="text-sm text-gray-500 mb-2">最近 30 天打卡</view>
      <!-- <canvas canvas-id="barChart" id="barChart" class="w-full h-40" /> -->
      <view class="charts-box" id="barChart">
        <qiun-data-charts type="column" :opts="opts" :chartData="chartData" />
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="flex justify-center gap-4 mt-2">
      <button
        class="bg-white border border-indigo-200 text-indigo-600 rounded-full px-4 py-1 text-sm shadow"
        @tap="goBack"
      >
        返回主页
      </button>
      <button
        class="bg-indigo-500 text-white rounded-full px-4 py-1 text-sm shadow"
        @tap="goToLearn"
      >
        去学习
      </button>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

// import * as echarts from '@/utils/echarts' // 自行封装或者引入 echarts 支持
const totalCount = ref(0)
const latestCheckin = ref('')
const calendarData = ref([])

const opts = {
  color: ['#575dea'],
  padding: [15, 15, 0, 5],
  enableScroll: false,
  legend: {},
  xAxis: {
    disableGrid: true,
  },
  yAxis: {
    data: [
      {
        min: 0,
      },
    ],
  },
  extra: {
    column: {
      type: 'group',
      width: 20,
      customColor: ['#575dea', '#575dea'],
      activeBgColor: '#000000',
      activeBgOpacity: 0.08,
      linearType: 'custom',
    },
  },
}
const chartData = ref({
  color: ['#575dea'],
  categories: ['2018', '2019', '2020', '2021', '2022', '2023'],
  series: [
    {
      name: '目标值',
      data: [35, 36, 31, 33, 13, 34],
    },
  ],
})

onMounted(async () => {
  const res = await uniCloud
    .importObject('course-checkin', { customUI: true })
    .getCalendarCheckinData()
  const data = res?.data || []

  calendarData.value = data
  totalCount.value = data.reduce((sum, item) => sum + item.count, 0)
  latestCheckin.value = data.filter((i) => i.count > 0).slice(-1)[0]?.date || ''

  await nextTick()
  // initChart(data)
})

// function initChart(data) {
//   const chart = echarts.init(document.getElementById('barChart'))
//   chart.setOption({
//     tooltip: { trigger: 'axis' },
//     xAxis: {
//       type: 'category',
//       data: data.map((d) => d.date.slice(5)), // 显示 MM-DD
//       axisLabel: { rotate: 45 },
//     },
//     yAxis: { type: 'value' },
//     series: [
//       {
//         data: data.map((d) => d.count),
//         type: 'bar',
//         itemStyle: { color: '#6366F1' },
//       },
//     ],
//   })
// }

const goBack = () => uni.navigateBack()
const goToLearn = () => uni.navigateTo({ url: '/pages/learn/index' })
</script>

<style scoped>
.charts-box {
  width: 100%;
  height: 300px;
}
</style>
