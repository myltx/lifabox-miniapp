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

          <wd-datetime-picker
            v-model="formData.start_time"
            label="开始时间"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始时间"
            align-right
          />

          <!-- 新的课程周期：数值 + 单位 -->
          <wd-input
            v-model.number="formData.shelfLife"
            label="课程周期"
            type="number"
            placeholder="请输入周期数值"
            align-right
            @input="updateDurationDays"
          >
            <template #suffix>
              <wd-picker
                ref="timeUnitPicker"
                v-model="formData.timeUnit"
                :columns="timeUnits"
                custom-class="custom-picker"
                use-default-slot
                @change="updateDurationDays"
              >
                <view class="time-unit-text">{{ getTimeUnitText(formData.timeUnit) }}</view>
              </wd-picker>
            </template>
          </wd-input>

          <!-- 显示实际天数 -->
          <view v-if="formData.duration_days > 0" class="text-sm text-green-600 mt-2 ml-2">
            📅 实际课程周期为：
            <text class="font-bold">{{ formData.duration_days }}</text>
            天
          </view>

          <wd-textarea
            v-model="formData.description"
            label="课程描述"
            placeholder="请输入课程描述"
            :maxlength="300"
            show-count
          />
        </wd-cell-group>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <wd-button type="primary" block @click="onSubmit">保存课程</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单数据
const formData = ref({
  name: '',
  start_time: '',
  description: '',
  shelfLife: null, // 输入的数值
  timeUnit: '', // 时间单位
  duration_days: 0, // 自动计算得出
})

// 单位选项
const timeUnits = [
  { text: '天', value: 'day' },
  { text: '周', value: 'week' },
  { text: '月', value: 'month' },
  { text: '年', value: 'year' },
]

// 获取单位中文文本
const getTimeUnitText = (unit: string) => {
  const found = timeUnits.find((item) => item.value === unit)
  return found?.text || '单位'
}

// 计算 duration_days
const updateDurationDays = () => {
  const value = formData.value.shelfLife
  const unit = formData.value.timeUnit

  if (value && unit) {
    switch (unit) {
      case 'day':
        formData.value.duration_days = value
        break
      case 'week':
        formData.value.duration_days = value * 7
        break
      case 'month':
        formData.value.duration_days = value * 30
        break
      case 'year':
        formData.value.duration_days = value * 365
        break
      default:
        formData.value.duration_days = 0
    }
  } else {
    formData.value.duration_days = 0
  }
}

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
  if (!formData.value.description) {
    uni.showToast({ title: '请输入课程描述', icon: 'none' })
    return false
  }
  if (!formData.value.duration_days || formData.value.duration_days <= 0) {
    uni.showToast({ title: '请输入有效的课程周期', icon: 'none' })
    return false
  }
  return true
}

// 表单提交
const onSubmit = async () => {
  if (!validateForm()) return

  try {
    await uniCloud
      .database()
      .collection('courses')
      .add({
        ...formData.value,
        start_time: new Date(formData.value.start_time),
      })

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

.time-unit-text {
  padding: 0 4px;
  color: #333;
}
</style>
