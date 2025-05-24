<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '物品',
  },
}
</route>
<template>
  <view class="page-container">
    <!-- 顶部区域 -->
    <view class="header">
      <view class="title">我的物品</view>
      <view class="subtitle">共 {{ totalItems }} 件物品</view>
    </view>

    <!-- 分类 Tabs -->
    <wd-tabs v-model="selectedTab" swipeable class="custom-tabs">
      <block v-for="(category, index) in categories" :key="category.id">
        <wd-tab :title="category.name">
          <!-- 当前分类下的物品列表 -->
          <view class="items-container">
            <view v-for="item in items" :key="item.id" class="item-card" @click="onItemClick(item)">
              <view class="item-content">
                <view class="item-left">
                  <text class="item-name">{{ item.name }}</text>
                  <view class="item-info">
                    <text class="expire-date">
                      <text class="icon">📅</text>
                      {{ item.expiry_date }}
                    </text>
                    <text class="remaining-days" :class="getDaysClass(item.expiry_date)">
                      {{ getRemainingDays(item.expiry_date) }}
                    </text>
                  </view>
                </view>
                <view class="item-right">
                  <view
                    class="expire-tag"
                    :class="getExpireTagClass(item.expiry_date)"
                    v-if="isExpiringSoon(item.expiry_date)"
                  >
                    {{ getExpireStatus(item.expiry_date) }}
                  </view>
                </view>
              </view>
            </view>

            <view v-if="filteredItems(category.id).length === 0" class="empty-state">
              <wd-status-tip image="search" tip="~暂无物品，快去添加吧" />
            </view>
          </view>
        </wd-tab>
      </block>
    </wd-tabs>

    <!-- 添加按钮 -->
    <view class="add-button" @click="onAddItem">
      <wd-button type="primary" icon="add" shape="circle" size="large"></wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const itemCategories = uniCloud.importObject('itemCategories', {
  customUI: true,
})

const itemsApi = uniCloud.importObject('items', {
  customUI: true,
})

// 当前选中的分类标签 index
const selectedTab = ref(0)

// 分类列表（可扩展从数据库读取）
const categories = ref([])

// 物品数据示例
const items = ref([])

// 计算总物品数
const totalItems = computed(() => items.value.length)

const getData = async () => {
  const categoriesData = await itemCategories.list({})
  categories.value =
    categoriesData.data?.map((item) => {
      item.name = `${item.icon} ${item.name}`
      return item
    }) || []

  const itemsData = await itemsApi.list({})
  items.value = itemsData.data?.list || []
  console.log('获取物品数据:', items.value)
}

onShow(async () => {
  getData()
})

// 过滤指定分类下的物品
const filteredItems = (categoryId: number) => {
  return items.value.filter((item) => item.categoryId === categoryId)
}

// 判断是否即将过期（3天内）
const isExpiringSoon = (expireDate: string) => {
  const today = new Date()
  const expire = new Date(expireDate)
  const diffDays = (expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= 3
}

// 格式化日期
const formatDate = (date: string) => {
  return date.replace(/-/g, '.')
}

// 获取剩余天数
const getRemainingDays = (expireDate: string) => {
  const today = new Date()
  console.log(expireDate, 'expireDate')
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return '已过期'
  if (diffDays === 0) return '今天到期'
  return `还剩 ${diffDays} 天`
}

// 获取日期状态对应的样式类
const getDaysClass = (expireDate: string) => {
  const days = (new Date(expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  if (days < 0) return 'expired'
  if (days <= 3) return 'expiring-soon'
  return 'normal'
}

// 获取过期状态样式
const getExpireTagClass = (expireDate: string) => {
  const days = (new Date(expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  if (days < 0) return 'expired'
  if (days <= 3) return 'expiring-soon'
  return 'normal'
}

// 获取过期状态文本
const getExpireStatus = (expireDate: string) => {
  const days = (new Date(expireDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  if (days < 0) return '已过期'
  if (days <= 3) return '即将过期'
  return ''
}

// 点击物品
const onItemClick = (item: any) => {
  uni.navigateTo({ url: `/pages/items/detail?id=${item.id}` })
}

// 点击添加物品
const onAddItem = () => {
  uni.navigateTo({ url: '/pages/items/add' }) // 你需要创建该页面
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding-bottom: 60px;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
}

.header {
  padding: 20px 16px;
  background: #ffffff;
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.title {
  margin-bottom: 4px;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
}

.subtitle {
  font-size: 14px;
  color: #64748b;
}

.custom-tabs {
  margin-top: 12px;
  background: transparent;
}

.items-container {
  padding: 12px;
}

.item-card {
  padding: 16px;
  margin-bottom: 12px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.item-name {
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
}

.item-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.expire-date {
  font-size: 12px;
  color: #64748b;
}

.icon {
  margin-right: 4px;
}

.remaining-days {
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 6px;
}

.expire-tag {
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.empty-image {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #94a3b8;
}

.add-button {
  position: fixed;
  right: 20px;
  bottom: 40px;
  z-index: 100;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
}
/* 添加剩余天数对应的样式 */
.remaining-days.normal {
  color: #10b981;
  background: #dcfce7;
}

.remaining-days.expiring-soon {
  color: #d97706;
  background: #fef3c7;
}

.remaining-days.expired {
  color: #ef4444;
  background: #fee2e2;
}
/* 添加一些优化的样式 */
.item-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.item-left {
  flex: 1;
}

.item-right {
  margin-left: 12px;
}
</style>
