<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '新增课程',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="form-container">
      <!-- 基本信息 -->
      <view class="form-section">
        <view class="section-title">课程信息</view>
        <wd-cell-group>
          <wd-input
            v-model="formData.name"
            label="课程名称"
            placeholder="请输入课程名称"
            clearable
            align-right
          />

          <wd-input
            v-model="formData.teacherName"
            label="教师名称"
            placeholder="请输入教师名称"
            clearable
            align-right
          />

          <wd-datetime-picker
            v-model="formData.start_time"
            label="开始时间"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间"
            align-right
          />

          <wd-input
            v-model.number="formData.duration_weeks"
            label="课程时长"
            type="number"
            placeholder="请输入持续周数"
            align-right
          />
          <wd-select-picker
            label="上课星期"
            v-model="formData.weekdays"
            align-right
            :columns="weekdayOptions"
          ></wd-select-picker>
        </wd-cell-group>
      </view>
      <view class="form-section">
        <view class="section-title">课程描述</view>
        <wd-cell-group>
          <wd-textarea
            v-model="formData.description"
            label="课程描述"
            align-right
            placeholder="请输入课程描述"
            :maxlength="300"
            show-count
          />
        </wd-cell-group>
      </view>
      <!-- 预览课程排期 -->
      <view class="form-section" v-if="schedulePreview.length">
        <view class="section-title">课程排期</view>
        <view class="schedule-list">
          <view class="schedule-item" v-for="(date, idx) in schedulePreview" :key="idx">
            {{ idx + 1 }}. {{ date }}
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <wd-button type="primary" block @click="onSubmit">保存课程</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import dayjs from 'dayjs'

const courses = uniCloud.importObject('courses', {
  customUI: true,
})
// 表单数据
const formData = ref({
  name: '测试课程',
  teacherName: '测试',
  start_time: '',
  description: '描述',
  duration_weeks: null,
  weekdays: [], // e.g., [1, 3, 5]
})

// 星期选项
const weekdayOptions = [
  {
    value: '0',
    label: '周日',
  },
  {
    value: '1',
    label: '周一',
  },
  {
    value: '2',
    label: '周二',
  },
  {
    value: '3',
    label: '周三',
  },
  {
    value: '4',
    label: '周四',
  },
  {
    value: '5',
    label: '周五',
  },
  {
    value: '6',
    label: '周六',
  },
]

// 根据 start_time + duration_weeks + weekdays 自动生成 schedule
const schedulePreview = computed(() => {
  if (
    !formData.value.start_time ||
    !formData.value.duration_weeks ||
    !formData.value.weekdays.length
  )
    return []

  const result: string[] = []
  const start = dayjs(formData.value.start_time).startOf('day')

  for (let i = 0; i <= formData.value.duration_weeks; i++) {
    for (const weekday of formData.value.weekdays) {
      const day = start.add(i, 'week').day(Number(weekday))
      if (day.isAfter(start) || day.isSame(start)) {
        result.push(day.format('YYYY-MM-DD'))
      }
    }
  }

  return result.sort()
})

// 表单验证
const validateForm = () => {
  if (!formData.value.name) {
    uni.showToast({ title: '请输入课程名称', icon: 'none' })
    return false
  }
  if (!formData.value.start_time) {
    uni.showToast({ title: '请选择开始时间', icon: 'none' })
    return false
  }
  if (!formData.value.duration_weeks || formData.value.duration_weeks <= 0) {
    uni.showToast({ title: '请输入有效的持续周数', icon: 'none' })
    return false
  }
  if (!formData.value.weekdays.length) {
    uni.showToast({ title: '请选择上课的星期', icon: 'none' })
    return false
  }
  return true
}

// 表单提交
const onSubmit = async () => {
  if (!validateForm()) return

  try {
    await courses.add(formData.value)

    uni.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      },
    })
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  padding-bottom: 120px;
  background: #f8fafc;
}

.form-container {
  padding: 16px;
}

.form-section {
  padding: 16px;
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
}

.section-title {
  padding-left: 12px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  border-left: 4px solid #0ea5e9;
}

.weekday-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 8px 0;
}

.schedule-list {
  padding-left: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
}

.footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.05);
}

:deep(.wd-cell) {
  padding: 16px;
}

:deep(.wd-textarea) {
  min-height: 120px;
  padding: 12px;
}

:deep(.wd-button--primary) {
  background: #0ea5e9;
  border-color: #0ea5e9;
}
</style>
