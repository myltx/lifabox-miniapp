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
          <view class="font-bold">{{ task.name }}</view>
          <view class="text-xs" :class="task.has_checked_in ? 'text-green-500' : 'text-gray-400'">
            {{ task.has_checked_in ? '✅ 已完成' : '🔲 未完成' }}
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
          @click="handleCheckIn(task.course_id)"
          :disabled="task.has_checked_in"
        >
          {{ task.has_checked_in ? '已打卡' : '打卡完成' }}
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
  course_id: number
  name: string
  has_checked_in: boolean
  progress: {
    total: number
    completed: number
  }
}

const courses = uniCloud.importObject('courses', {
  customUI: true,
})

const courseCheckin = uniCloud.importObject('course-checkin', {
  customUI: true,
})

const getCourseList = async () => {
  const data = await courses.today()
  console.log('课程列表', data)
  todayTasks.value = data?.data || []
}
getCourseList()

const showCelebration = ref(false)

const todayTasks = ref<Task[]>([])

const handleCheckIn = async (taskId: number) => {
  if (showCelebration.value) return // 防止重复打卡
  const task = todayTasks.value.find((t) => t.course_id === taskId)
  if (!task || task.has_checked_in) return
  try {
    await courseCheckin.checkIn({
      course_id: taskId,
    })
    task.has_checked_in = true
    task.progress.completed += 1
    showCelebration.value = true
    setTimeout(() => {
      showCelebration.value = false
    }, 2000)
  } catch (error) {
    console.error('打卡失败', error)
    uni.showToast({
      title: '打卡失败' + error.message,
      icon: 'none',
    })
  }
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
