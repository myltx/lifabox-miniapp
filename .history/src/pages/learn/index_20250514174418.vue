<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '学习',
  },
}
</route>

<template>
  <view class="h-[100vh]">
    <wd-calendar-view v-model="value" @change="handleChange" />
  </view>
</template>

<script lang="ts" setup>
const value = ref(Date.now())
const handleChange = (e) => {
  console.log(e)
}
</script>

<style lang="scss" scoped>
//
</style>
