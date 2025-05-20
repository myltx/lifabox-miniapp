<template>
  <view class="p-4 bg-[#f7f7f7] h-[96vh]">
    <view class="bg-blue-100 text-blue-800 rounded-xl shadow-sm space-y-4 px-4 pb-4">
      <view class="text-sm mb-3 p-4">📚 今日学习计划</view>

      <view
        v-for="task in todayTasks"
        :key="task.id"
        class="mb-3 p-3 bg-white rounded-xl shadow-sm"
      >
        <!-- 标题 + 状态 -->
        <view class="flex justify-between items-center">
          <view class="font-bold">{{ task.title }}</view>
          <view class="text-xs" :class="task.completed ? 'text-green-500' : 'text-gray-400'">
            {{ task.completed ? '✅ 已完成' : '🔲 未完成' }}
          </view>
        </view>

        <!-- 子任务进度条 -->
        <view class="mt-2">
          <view class="text-xs text-gray-500 mb-1">
            完成进度：{{ task.progress.completed }}/{{ task.progress.total }}
          </view>
          <view class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <view
              class="h-2 bg-blue-500 transition-all duration-300"
              :style="{ width: (task.progress.completed / task.progress.total) * 100 + '%' }"
            ></view>
          </view>
        </view>

        <!-- 打卡按钮 -->
        <button
          class="btn mt-3 text-xs bg-blue-100 text-blue-700 rounded-full px-3 py-1"
          @click="handleCheckIn(task.id)"
          :disabled="task.completed"
        >
          {{ task.completed ? '已打卡' : '打卡完成' }}
        </button>
      </view>
    </view>
    <!-- 添加课程按钮 -->
    <view class="add-button" @click="onAddCourse">
      <wd-button type="primary" icon="add" shape="circle" size="large"></wd-button>
    </view>

    <!-- 庆祝动画组件 -->
    <CelebrationAnimation :show="showCelebration" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CelebrationAnimation from '@/components/CelebrationAnimation/index.vue'

interface Task {
  id: number
  title: string
  completed: boolean
  progress: {
    total: number
    completed: number
  }
}

const showCelebration = ref(false)

const todayTasks = ref<Task[]>([
  {
    id: 1,
    title: '英语听力练习',
    completed: false,
    progress: { total: 1, completed: 0 },
  },
  {
    id: 2,
    title: '技术博客阅读',
    completed: false,
    progress: { total: 1, completed: 0 },
  },
])

const handleCheckIn = (taskId: number) => {
  if (showCelebration.value) return // 防止重复打卡
  const task = todayTasks.value.find((t) => t.id === taskId)
  if (!task || task.completed) return

  task.completed = true
  task.progress.completed = task.progress.total

  // uni.showToast({
  //   title: '🎉 打卡成功！',
  //   icon: 'none',
  // })
  showCelebration.value = true
  setTimeout(() => {
    showCelebration.value = false
  }, 3000)
}
// 点击添加课程
const onAddCourse = () => {
  uni.navigateTo({ url: '/pages/courses/add' }) // 你需要创建该页面
}
</script>

<style scoped lang="scss">
.btn:active {
  opacity: 0.8;
}
.add-button {
  position: fixed;
  right: 20px;
  bottom: 40px;
  z-index: 100;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.1));
}
</style>
