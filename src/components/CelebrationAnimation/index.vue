<template>
  <view class="celebration-container" v-if="show">
    <!-- 多种形状的粒子 -->
    <view
      v-for="(particle, index) in particles"
      :key="index"
      class="particle"
      :class="`shape-${particle.shape}`"
      :style="{
        left: `${particle.x}px`,
        top: `${particle.y}px`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        backgroundColor: particle.color,
        opacity: particle.opacity,
        transform: `rotate(${particle.rotation}deg)`,
        '--shape-color': particle.color,
      }"
    ></view>

    <!-- 中心庆祝文字 -->
    <view class="celebration-text" v-if="showText">恭喜完成!</view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  showText: {
    type: Boolean,
    default: true,
  },
  particleCount: {
    type: Number,
    default: 50,
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

// 定义粒子形状类型
type ParticleShape = 'circle' | 'square' | 'triangle' | 'star'

interface Particle {
  x: number
  y: number
  size: number
  color: string
  shape: ParticleShape
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
  fadeSpeed: number
}

const particles = ref<Particle[]>([])
let animationTimer: number | null = null
let startTime: number | null = null

// 获取窗口尺寸
const getWindowSize = () => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    return {
      width: systemInfo.windowWidth,
      height: systemInfo.windowHeight,
    }
  } catch (e) {
    console.error('获取窗口尺寸失败:', e)
    return { width: 375, height: 667 } // 默认值
  }
}

// 初始化粒子
const initParticles = () => {
  const { width, height } = getWindowSize()
  const colors = ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#B388FF', '#FF80AB']
  const shapes: ParticleShape[] = ['circle', 'square', 'triangle', 'star']

  particles.value = Array.from({ length: props.particleCount }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 3

    return {
      x: width / 2,
      y: height / 2,
      size: 8 + Math.random() * 12, // 稍微增大尺寸以便看清形状
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
      fadeSpeed: 0.005 + Math.random() * 0.01,
    }
  })
}

// 更新粒子位置
const updateParticles = () => {
  const now = Date.now()
  if (!startTime) startTime = now

  const elapsed = now - startTime
  if (elapsed < props.duration) {
    particles.value = particles.value.map((p) => ({
      ...p,
      x: p.x + p.speedX,
      y: p.y + p.speedY + 0.1, // 重力效果
      rotation: p.rotation + p.rotationSpeed,
      opacity: Math.max(0, p.opacity - p.fadeSpeed),
    }))

    animationTimer = setTimeout(updateParticles, 16) // ~60fps
  } else {
    // 动画结束
    particles.value = []
    if (animationTimer) {
      clearTimeout(animationTimer)
      animationTimer = null
    }
  }
}

// 开始动画
const startAnimation = () => {
  initParticles()
  startTime = null
  animationTimer = setTimeout(updateParticles, 16)
}

// 监听show变化
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      startAnimation()
    } else {
      particles.value = []
      if (animationTimer) {
        clearTimeout(animationTimer)
        animationTimer = null
      }
    }
  },
)

onMounted(() => {
  if (props.show) startAnimation()
})

onUnmounted(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
})
</script>

<style scoped>
.celebration-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  overflow: visible;
  pointer-events: none;
}

.particle {
  position: absolute;
  pointer-events: none;
  transform-origin: center;
  will-change: transform, opacity;
}
/* 圆形 */
.shape-circle {
  background-color: var(--shape-color);
  border-radius: 50%;
}
/* 方形 */
.shape-square {
  background-color: var(--shape-color);
}
/* 三角形 */
.shape-triangle {
  width: 0;
  height: 0;
  background-color: transparent;
  border-right: calc(var(--size) / 2) solid transparent;
  border-bottom: var(--size) solid var(--shape-color);
  border-left: calc(var(--size) / 2) solid transparent;
}
/* 星形 - 使用CSS创建简单的五角星 */
.shape-star {
  position: relative;
  background-color: transparent;
}

.shape-star::before {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  font-size: var(--size);
  line-height: var(--size);
  color: var(--shape-color);
  content: '★';
  transform: translate(-50%, -50%);
}

.celebration-text {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 36px;
  font-weight: bold;
  color: #ff5252;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  transform: translate(-50%, -50%);
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}
</style>
