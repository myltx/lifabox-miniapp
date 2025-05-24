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
      <!-- 分类名称 -->
      <view>
        <view class="text-sm text-gray-700 mb-1">分类名称</view>
        <input
          class="bg-gray-50 px-3 py-2 rounded-xl w-full border border-gray-200"
          placeholder="请输入分类名称"
          v-model="form.name"
        />
      </view>

      <!-- 分类描述 -->
      <view>
        <view class="text-sm text-gray-700 mb-1">分类描述</view>
        <textarea
          class="bg-gray-50 px-3 py-2 rounded-xl w-full border border-gray-200 h-24"
          placeholder="请输入描述"
          v-model="form.description"
        />
      </view>

      <!-- 分类图标选择 -->
      <view>
        <view class="flex justify-between items-center mb-1">
          <view class="text-sm text-gray-700">分类图标</view>
          <view class="text-xs text-indigo-500" @click="showAllCategories = !showAllCategories">
            {{ showAllCategories ? '收起分类' : '展开所有分类' }}
          </view>
        </view>

        <!-- 搜索框 -->
        <input
          v-model="searchText"
          class="bg-gray-50 px-3 py-2 rounded-xl w-full border border-gray-200 mb-2"
          placeholder="搜索图标..."
        />

        <!-- 分类筛选 -->
        <view class="flex flex-wrap gap-2 mb-3" v-if="showAllCategories">
          <view
            v-for="cat in categories"
            :key="cat"
            class="text-xs px-2 py-1 rounded-full"
            :class="
              activeCategory === cat ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
            "
            @click="activeCategory = activeCategory === cat ? '' : cat"
          >
            {{ cat }}
          </view>
        </view>

        <!-- 当前选中图标预览 -->
        <view v-if="form.icon" class="mb-3 flex items-center">
          <view class="text-2xl mr-2">{{ form.icon }}</view>
          <view class="text-sm text-gray-600">
            {{ getEmojiInfo(form.icon)?.description || '' }}
          </view>
        </view>

        <!-- Emoji图标列表 -->
        <view class="flex flex-wrap gap-3 max-h-80 overflow-y-auto">
          <view
            v-for="emoji in filteredEmojis"
            :key="emoji.emoji"
            class="text-2xl p-2 border rounded-xl cursor-pointer"
            :class="
              form.icon === emoji.emoji
                ? 'bg-indigo-100 border-indigo-500'
                : 'border-gray-200 bg-gray-50'
            "
            @click="form.icon = emoji.emoji"
          >
            {{ emoji.emoji }}
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
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
import { reactive, ref, computed } from 'vue'
import { useToast } from 'wot-design-uni'

const itemCategories = uniCloud.importObject('itemCategories', {
  customUI: true,
})

const toast = useToast()

// Emoji数据
const emojiData = [
  {
    emoji: '📚',
    description: '书籍',
    category: '物品',
    aliases: ['书本', '书籍'],
    tags: ['学习', '阅读', '教育'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '💼',
    description: '公文包',
    category: '物品',
    aliases: ['工作包', '商务包'],
    tags: ['工作', '商务', '职业'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🍔',
    description: '汉堡包',
    category: '食物',
    aliases: ['汉堡', '快餐'],
    tags: ['美食', '快餐', '西餐'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🎮',
    description: '游戏手柄',
    category: '活动',
    aliases: ['游戏机', '电玩'],
    tags: ['游戏', '娱乐', '电竞'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🎵',
    description: '音符',
    category: '符号',
    aliases: ['音乐', '乐符'],
    tags: ['歌曲', '旋律', '艺术'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🧹',
    description: '扫帚',
    category: '物品',
    aliases: ['打扫', '清洁'],
    tags: ['家务', '清理', '卫生'],
    unicode_version: '11.0',
    ios_version: '12.1',
  },
  {
    emoji: '🚗',
    description: '小汽车',
    category: '交通',
    aliases: ['汽车', '轿车'],
    tags: ['驾驶', '出行', '交通工具'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🏠',
    description: '房屋',
    category: '地点',
    aliases: ['家', '房子'],
    tags: ['住宅', '家庭', '住所'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🛒',
    description: '购物车',
    category: '物品',
    aliases: ['超市车', '手推车'],
    tags: ['购物', '超市', '采购'],
    unicode_version: '9.0',
    ios_version: '10.2',
  },
  {
    emoji: '📦',
    description: '快递箱',
    category: '物品',
    aliases: ['包裹', '纸箱'],
    tags: ['快递', '邮寄', '运输'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '💄',
    description: '口红',
    category: '物品',
    aliases: ['唇膏', '化妆品'],
    tags: ['美妆', '彩妆', '打扮'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '💅',
    description: '美甲',
    category: '活动',
    aliases: ['指甲油', '美甲'],
    tags: ['美容', '护理', '美妆'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🧴',
    description: '乳液瓶',
    category: '物品',
    aliases: ['护肤品', '乳液'],
    tags: ['护肤', '保湿', '美容'],
    unicode_version: '11.0',
    ios_version: '12.1',
  },
  {
    emoji: '🧼',
    description: '肥皂',
    category: '物品',
    aliases: ['香皂', '洗手皂'],
    tags: ['清洁', '卫生', '洗漱'],
    unicode_version: '11.0',
    ios_version: '12.1',
  },
  {
    emoji: '🪒',
    description: '剃须刀',
    category: '物品',
    aliases: ['刮胡刀', '剃刀'],
    tags: ['剃须', '修面', '个人护理'],
    unicode_version: '12.0',
    ios_version: '13.0',
  },
  {
    emoji: '🪮',
    description: '发簪',
    category: '物品',
    aliases: ['头簪', '发饰'],
    tags: ['传统', '发型', '装饰'],
    unicode_version: '14.0',
    ios_version: '15.4',
  },
  {
    emoji: '🧽',
    description: '海绵',
    category: '物品',
    aliases: ['清洁海绵', '洗碗棉'],
    tags: ['清洁', '厨房', '洗碗'],
    unicode_version: '11.0',
    ios_version: '12.1',
  },
  {
    emoji: '💇',
    description: '理发',
    category: '活动',
    aliases: ['剪发', '美发'],
    tags: ['发型', '理发店', '造型'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '💆',
    description: '按摩',
    category: '活动',
    aliases: ['推拿', 'SPA'],
    tags: ['放松', '理疗', '护理'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🧖',
    description: '桑拿',
    category: '活动',
    aliases: ['蒸汽浴', '汗蒸'],
    tags: ['放松', '养生', '水疗'],
    unicode_version: '11.0',
    ios_version: '12.1',
  },
  {
    emoji: '🌸',
    description: '樱花',
    category: '自然',
    aliases: ['樱桃花', '粉花'],
    tags: ['春天', '花卉', '美丽'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '🌺',
    description: '芙蓉花',
    category: '自然',
    aliases: ['木槿花', '热带花'],
    tags: ['夏威夷', '热带', '花卉'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '💐',
    description: '花束',
    category: '自然',
    aliases: ['鲜花', '花礼'],
    tags: ['礼物', '庆祝', '浪漫'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '👗',
    description: '连衣裙',
    category: '服饰',
    aliases: ['裙子', '连身裙'],
    tags: ['女装', '时尚', '夏季'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
  {
    emoji: '👠',
    description: '高跟鞋',
    category: '服饰',
    aliases: ['女鞋', '宴会鞋'],
    tags: ['时尚', '晚装', '女性'],
    unicode_version: '6.0',
    ios_version: '6.0',
  },
]

// 获取所有分类
const categories = [...new Set(emojiData.map((item) => item.category))]

const form = reactive({
  name: '',
  description: '',
  icon: '',
})

const searchText = ref('')
const activeCategory = ref('')
const showAllCategories = ref(false)

// 获取emoji详情
const getEmojiInfo = (emoji: string) => {
  return emojiData.find((item) => item.emoji === emoji)
}

// 过滤emoji列表
const filteredEmojis = computed(() => {
  return emojiData.filter((emoji) => {
    // 分类筛选
    if (activeCategory.value && emoji.category !== activeCategory.value) {
      return false
    }

    // 搜索筛选
    if (searchText.value) {
      const search = searchText.value.toLowerCase()
      return (
        emoji.description.includes(search) ||
        emoji.aliases.some((alias) => alias.includes(search)) ||
        emoji.tags.some((tag) => tag.includes(search))
      )
    }

    return true
  })
})

async function submit() {
  if (!form.name) {
    toast.show('分类名称不能为空')
    return
  }

  // if (!form.icon) {
  //   toast.show('请选择一个分类图标')
  //   return
  // }

  // 获取选中的emoji信息
  console.log(form.icon, 'form.icon')
  // const emojiInfo = getEmojiInfo(form.icon)

  // 构造提交数据
  const submitData = {
    ...form,
    // icon: emojiInfo.emoji, // 包含完整的emoji信息
  }

  try {
    await itemCategories.add(submitData)
    console.log('提交成功')
    toast.show('提交成功')
    uni.navigateBack()
  } catch (error) {
    console.error('提交失败', error)
    toast.show('提交失败: ' + error.message)
    return
  }

  console.log('提交数据:', submitData)
  toast.show('分类已保存')

  // TODO: 提交逻辑
  // await api.createCategory(submitData)

  uni.navigateBack()
}
</script>
