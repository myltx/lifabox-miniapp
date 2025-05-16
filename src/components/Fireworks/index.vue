<template>
  <canvas
    v-if="show"
    class="fireworks-canvas"
    :canvas-id="canvasId"
    :style="{ width: width + 'px', height: height + 'px' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const show = ref(false)
const canvasId = 'fireworks-canvas'
const width = ref(0)
const height = ref(0)

let timer: ReturnType<typeof setTimeout> | null = null

// 生成随机十六进制颜色
function getRandomColor() {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, '0')
  return `#${r}${g}${b}`
}

// 绘制一次爆炸烟花
function drawFireworks(ctx: UniApp.CanvasContext) {
  const particles = []
  const count = 40
  const cx = width.value / 2
  const cy = height.value / 2

  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx,
      y: cy,
      radius: Math.random() * 3 + 2,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 3 + 1,
      color: getRandomColor(),
    })
  }

  let frame = 0
  const interval = setInterval(() => {
    ctx.clearRect(0, 0, width.value, height.value)
    for (const p of particles) {
      const dx = Math.cos(p.angle) * p.speed
      const dy = Math.sin(p.angle) * p.speed
      p.x += dx
      p.y += dy
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
      ctx.setFillStyle(p.color)
      ctx.fill()
    }
    ctx.draw()
    frame++
    if (frame > 30) clearInterval(interval) // 动画帧数控制
  }, 33)
}

// 启动烟花
function startFireworks(duration = 3000) {
  show.value = true
  nextTick(() => {
    const ctx = uni.createCanvasContext(canvasId)
    console.log(ctx, 'ctx')
    drawFireworks(ctx)
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      show.value = false
    }, duration)
  })
}

// 暴露 start 方法
defineExpose({
  startFireworks,
})

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  width.value = sys.windowWidth
  height.value = sys.windowHeight
})
</script>

<style scoped>
.fireworks-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
}
</style>
