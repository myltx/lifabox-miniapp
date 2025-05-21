<template>
  <view class="p-4 space-y-6 bg-[#f7f7f7] h-[100vh] flex flex-col justify-center">
    <!-- 顶部 Banner -->
    <view
      class="bg-gradient-to-r from-purple-400 to-blue-500 text-white rounded-2xl p-6 shadow-md text-center"
    >
      <view class="text-sm opacity-80">欢迎来到</view>
      <view class="text-2xl font-bold mt-1">LifaBox 生活助手</view>
    </view>

    <!-- 登录卡片 -->
    <view class="bg-white p-6 rounded-2xl shadow-md text-center">
      <view class="text-lg font-semibold mb-2">使用微信登录</view>
      <view class="text-sm text-gray-500 mb-4">登录后可同步学习记录、管理生活数据</view>

      <button
        class="bg-green-500 text-white px-4 py-2 rounded-full shadow text-sm"
        open-type="getUserInfo"
        @tap="handleWeixinLogin"
      >
        <text class="i-carbon-logo-wechat mr-2"></text>
        微信一键登录
      </button>

      <view class="text-xs text-gray-400 mt-4">
        登录代表你已同意
        <text class="text-blue-500">用户协议</text>
        与
        <text class="text-blue-500">隐私政策</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast',
  },
})

const handleWeixinLogin = async () => {
  try {
    const loginRes = await uni.login() // 获取 code
    const code = loginRes.code
    //     console.log('微信登录返回的 code:', code)
    const result = await uniIdCo.loginByWeixin({ code }) // ✅ 云对象方式
    const { errCode, type, newToken } = result
    console.log('登录结果:', result)
    // 调用你封装的后端微信登录函数（如你发的那段模块）
    //     const result = await uniCloud.callFunction({
    //       name: 'uni-id-co', // 你实际部署的云函数名称
    //       data: {
    //         action: 'loginByWeixin',
    //         code,
    //       },
    //     })

    // 登录成功处理逻辑
    if (errCode === 0) {
      uni.showToast({
        title: '登录成功 🎉',
        icon: 'none',
      })
      uni.switchTab({ url: '/pages/index/index' }) // 回首页
    } else {
      uni.showToast({
        title: '登录失败',
        icon: 'none',
      })
    }
  } catch (e) {
    console.error(e)
    uni.showToast({
      title: '微信登录异常',
      icon: 'none',
    })
  }
}
</script>

<style scoped>
button:active {
  opacity: 0.8;
}
</style>
