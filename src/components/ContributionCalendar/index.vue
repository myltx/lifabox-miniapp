<template>
  <view class="calendar-container">
    <view class="calendar-grid">
      <view v-for="(week, weekIndex) in calendar" :key="weekIndex" class="week-column">
        <view
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          class="day-cell"
          :style="{ backgroundColor: getColor(day.count) }"
        />
      </view>
    </view>
    <view class="calendar-footer">最近一年提交记录（日历）</view>
  </view>
</template>

<script setup lang="ts">
import { getCalendarData } from '@/composables/useContributionData'

const calendar = getCalendarData()

function getColor(count: number) {
  if (count === 0) return '#E5E7EB' // gray-200
  if (count < 2) return '#C7D2FE' // indigo-200
  if (count < 4) return '#A5B4FC' // indigo-300
  if (count < 6) return '#818CF8' // indigo-400
  return '#6366F1' // indigo-500
}
</script>

<style scoped>
.calendar-container {
  padding: 12px 16px;
  margin-top: 12px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
}

.calendar-grid {
  display: flex;
  flex-direction: row;
  gap: 2px;
  padding-bottom: 4px;
  overflow-x: auto;
}

.week-column {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day-cell {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}
.calendar-footer {
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}
</style>
