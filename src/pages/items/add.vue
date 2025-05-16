<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '新增物品',
  },
}
</route>

<template>
  <view class="page-container">
    <view class="form-container">
      <!-- 基本信息 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        <wd-cell-group>
          <wd-input
            v-model="formData.name"
            label="物品名称"
            placeholder="请输入物品名称"
            clearable
          />

          <wd-select-picker
            label="物品分类"
            v-model="formData.categoryId"
            :columns="categories"
          ></wd-select-picker>

          <!-- 生产日期 -->
          <wd-datetime-picker
            v-model="formData.productionDate"
            label="生产日期"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择生产日期"
          />

          <!-- 保质期 -->
          <wd-cell title="保质期">
            <view class="shelf-life-input">
              <wd-input
                v-model="formData.shelfLife"
                type="number"
                placeholder="输入保质期"
                style="width: 300px"
              />
              <wd-picker v-model="formData.timeUnit" :columns="timeUnits" style="width: 190px">
                <view class="time-unit-text">{{ getTimeUnitText(formData.timeUnit) }}</view>
              </wd-picker>
            </view>
          </wd-cell>

          <!-- 过期日期（自动计算，只读） -->
          <wd-cell title="过期日期">
            <text :class="['expire-date', getDaysClass(formData.expireDate)]">
              {{ formData.expireDate || '待计算' }}
            </text>
          </wd-cell>
        </wd-cell-group>
      </view>

      <!-- 备注信息 -->
      <view class="form-section">
        <view class="section-title">备注信息</view>
        <wd-cell-group>
          <wd-textarea
            v-model="formData.remark"
            placeholder="添加备注信息（选填）"
            :maxlength="200"
            show-count
          />
        </wd-cell-group>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <wd-button type="primary" block @click="onSubmit">保存</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'

// 表单数据
const formData = ref({
  name: '',
  categoryId: '',
  productionDate: '',
  shelfLife: '',
  timeUnit: 'day',
  expireDate: '',
  remark: '',
})

// 分类选择器显示控制
const showCategoryPicker = ref(false)

// 分类列表
const categories = [
  { id: 1, name: '食品' },
  { id: 2, name: '日用品' },
  { id: 3, name: '电子产品' },
  { id: 4, name: '其他' },
]

// 当前选中的分类名称
const categoryName = computed(() => {
  const category = categories.find((item) => item.id === formData.value.categoryId)
  return category ? category.name : '请选择'
})

// 今天日期
const today = dayjs().format('YYYY-MM-DD')

// 设置最小日期（比如一年前）和最大日期（今天）
const minDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD')

// 时间单位选项
const timeUnits = [
  { value: 'day', label: '天' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
]

// 获取时间单位显示文本
const getTimeUnitText = (value: string) => {
  const unit = timeUnits.find((item) => item.value === value)
  return unit ? unit.label : '天'
}

// 监听生产日期和保质期变化，自动计算过期日期
watch(
  [
    () => formData.value.productionDate,
    () => formData.value.shelfLife,
    () => formData.value.timeUnit,
  ],
  ([newProductionDate, newShelfLife, newTimeUnit]) => {
    try {
      if (newProductionDate && newShelfLife) {
        const shelfLife = parseInt(newShelfLife)
        if (isNaN(shelfLife) || shelfLife <= 0) return

        const date = dayjs(newProductionDate)
        if (!date.isValid()) return

        let expireDate
        switch (newTimeUnit) {
          case 'day':
            expireDate = date.add(shelfLife, 'day')
            break
          case 'month':
            expireDate = date.add(shelfLife, 'month')
            break
          case 'year':
            expireDate = date.add(shelfLife, 'year')
            break
          default:
            return
        }

        if (expireDate.isValid()) {
          formData.value.expireDate = expireDate.format('YYYY-MM-DD')
        }
      }
    } catch (error) {
      console.error('计算过期日期出错:', error)
      formData.value.expireDate = ''
    }
  },
  { immediate: true },
)

// 获取剩余天数状态样式
const getDaysClass = (expireDate: string) => {
  if (!expireDate) return ''
  const days = dayjs(expireDate).diff(dayjs(), 'day')
  if (days < 0) return 'expired'
  if (days <= 3) return 'expiring-soon'
  return 'normal'
}

// 表单验证
const validateForm = () => {
  if (!formData.value.name) {
    uni.showToast({ title: '请输入物品名称', icon: 'none' })
    return false
  }
  if (!formData.value.categoryId) {
    uni.showToast({ title: '请选择物品分类', icon: 'none' })
    return false
  }
  if (!formData.value.productionDate) {
    uni.showToast({ title: '请选择生产日期', icon: 'none' })
    return false
  }
  if (!formData.value.shelfLife) {
    uni.showToast({ title: '请输入保质期', icon: 'none' })
    return false
  }
  return true
}

// 表单提交
const onSubmit = () => {
  if (!validateForm()) return

  // TODO: 调用保存接口
  console.log('提交表单:', formData.value)

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
}
</script>

<style scoped>
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
/* 新增样式 */
.shelf-life-input {
  display: flex;
  gap: 8px;
  align-items: center;
}

.time-unit-text {
  min-width: 40px;
  padding: 4px 8px;
  font-size: 14px;
  color: #333;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.expire-date {
  padding: 4px 8px;
  font-size: 14px;
  border-radius: 4px;
}

.expire-date.normal {
  color: #10b981;
  background: #dcfce7;
}

.expire-date.expiring-soon {
  color: #d97706;
  background: #fef3c7;
}

.expire-date.expired {
  color: #ef4444;
  background: #fee2e2;
}

:deep(.wd-radio-group) {
  margin-left: 12px;
}

:deep(.wd-radio) {
  margin-right: 16px;
}
/* 调整输入框样式 */
:deep(.wd-input) {
  padding: 0 8px;
  /* border: 1px solid #ddd; */
  /* border-radius: 4px; */
}

:deep(.wd-input__inner) {
  text-align: center;
}
</style>
