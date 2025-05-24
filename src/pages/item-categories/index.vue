<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '物品分类',
  },
}
</route>

<template>
  <view class="p-4 bg-gray-100 min-h-screen space-y-4">
    <!-- 分类卡片列表 -->
    <view
      v-for="(item, index) in categories"
      :key="index"
      class="bg-white p-4 rounded-2xl shadow-md flex items-start justify-between"
    >
      <view>
        <view class="text-lg font-semibold text-gray-800">{{ item.icon }} {{ item.name }}</view>
        <view class="text-sm text-gray-500 mt-1">{{ item.description }}</view>
      </view>
      <!-- <text class="text-2xl text-gray-300">›</text> -->
    </view>

    <!-- 新增按钮 -->
    <button
      class="w-full bg-indigo-500 text-white text-base py-3 rounded-2xl shadow-md mt-6"
      @click="goToCreate"
    >
      新增分类
    </button>
  </view>
</template>

<script setup lang="ts">
const itemCategories = uniCloud.importObject('itemCategories', {
  customUI: true,
})

const categories = ref<any>([])

onShow(async () => {
  const data = await itemCategories.list({})
  console.log(data, 'data')
  categories.value = data.data || []
})

function goToCreate() {
  uni.navigateTo({ url: '/pages/item-categories/edit' })
}
</script>
