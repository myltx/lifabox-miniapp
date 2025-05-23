<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '新增分类',
  },
}
</route>

<template>
  <view class="p-4 bg-gray-100 min-h-screen">
    <view class="bg-white p-4 rounded-2xl shadow-md space-y-4">
      <view>
        <view class="text-sm text-gray-700 mb-1">分类名称</view>
        <input
          class="bg-gray-50 px-3 py-2 rounded-xl w-full border border-gray-200"
          placeholder="请输入分类名称"
          v-model="form.name"
        />
      </view>

      <view>
        <view class="text-sm text-gray-700 mb-1">分类描述</view>
        <textarea
          class="bg-gray-50 px-3 py-2 rounded-xl w-full border border-gray-200 h-24"
          placeholder="请输入描述"
          v-model="form.description"
        />
      </view>

      <button
        class="w-full bg-indigo-500 text-white text-base py-3 rounded-2xl shadow-md"
        @click="submit"
      >
        保存分类
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useToast } from 'wot-design-uni'
const toast = useToast()

const form = reactive({
  name: '',
  description: '',
})

function submit() {
  if (!form.name) {
    toast.show('分类名称不能为空')
    return
  }

  toast.show('分类已保存')
  // 提交逻辑：调用后端接口保存分类
  // await api.createCategory(form)

  // 返回分类列表页
  uni.navigateBack()
}
</script>
