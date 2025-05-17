<template>
  <canvas
    v-if="show"
    id="fireworks"
    canvas-id="fireworks"
    type="2d"
    enable-node
    class="fireworks-canvas"
    :style="{ width: width + 'px', height: height + 'px' }"
  />
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const show = ref(false)
const width = ref(0)
const height = ref(0)

let canvas: any = null
let ctx: WechatMiniprogram.CanvasRenderingContext2D | null = null

// 粒子生成
function createParticles(cx: number, cy: number, count = 40) {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: cx,
      y: cy,
      radius: Math.random() * 3 + 2,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 3 + 1,
      color: `rgb(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(
        Math.random() * 255
      )})`,
    })
  }
  return particles
}

function drawOnce(particles: any[]) {
  if (!ctx) return
  let frame = 0
  const timer = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.x += Math.cos(p.angle) * p.speed
      p.y += Math.sin(p.angle) * p.speed
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
      ctx.fillStyle = p.color
      ctx.fill()
    })
    frame++
    if (frame > 20) {
      clearInterval(timer)
      show.value = false
    }
  }, 33)
}

function startFireworks() {
  const sys = uni.getSystemInfoSync()
  width.value = sys.windowWidth
  height.value = sys.windowHeight
  show.value = true

  nextTick(() => {
    setTimeout(() => {
      uni
        .createSelectorQuery()
        .select('#fireworks')
        .fields({ node: true, size: true })
        .exec((res) => {
          const node = res[0]?.node
          if (!node) return
          canvas = node
          canvas.width = width.value
          canvas.height = height.value
          ctx = canvas.getContext('2d')

          const cx = canvas.width / 2
          const cy = canvas.height / 2
          const particles = createParticles(cx, cy)
          drawOnce(particles)
        })
    }, 100)
  })
}

defineExpose({ startFireworks })
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
