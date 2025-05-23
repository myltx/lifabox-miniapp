'use strict'

const uniID = require('uni-id-common')

module.exports = {
  /**
   * 初始化
   */
  _before: async function () {
    const clientInfo = this.getClientInfo()
    this.uniID = uniID.createInstance({ clientInfo })
  },

  /**
   * 打卡操作
   */
  checkIn: async function (params = {}) {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const { course_id, duration, proof = [], note = '' } = params
    console.log('打卡参数', params)
    // || typeof duration !== 'number' || duration <= 0
    if (!course_id) {
      return { code: 400, message: '缺少参数或参数非法' }
    }

    const today = new Date(formatDate(new Date()))
    const learningRecords = db.collection('learning_records')

    const existing = await learningRecords
      .where({
        user_id: userInfo.uid,
        course_id,
        date: today,
      })
      .get()

    if (existing.data.length > 0) {
      return { code: 409, message: '今日已打卡该课程' }
    }

    const now = new Date()
    await learningRecords.add({
      user_id: userInfo.uid,
      course_id,
      date: today,
      scheduled_date: today,
      duration,
      status: 'completed',
      proof,
      note,
      created_at: now,
      updated_at: now,
    })

    return { code: 0, message: '打卡成功' }
  },

  /**
   * 查询打卡记录
   */
  getRecords: async function (params = {}) {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const { course_id, date, page = 1, pageSize = 20 } = params
    const where = { user_id: userInfo.uid }
    if (course_id) where.course_id = course_id
    if (date) where.date = new Date(date)

    const res = await db
      .collection('learning_records')
      .where(where)
      .orderBy('date', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      message: '查询成功',
      data: res.data,
    }
  },

  /**
   * 今日是否已打卡
   */
  isCheckedInToday: async function (params = {}) {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const { course_id } = params
    if (!course_id) return { code: 400, message: '缺少课程 ID' }

    const today = new Date(formatDate(new Date()))
    const res = await db
      .collection('learning_records')
      .where({
        user_id: userInfo.uid,
        course_id,
        date: today,
      })
      .get()

    return {
      code: 0,
      message: '查询成功',
      data: {
        checked: res.data.length > 0,
      },
    }
  },
  /**
   * 获取总打卡次数, 按课程 ID 分组
   */
  getTotalCheckInCount: async function (params = {}) {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const { course_id } = params
    if (!course_id) return { code: 400, message: '缺少课程 ID' }

    const res = await db
      .collection('learning_records')
      .where({
        user_id: userInfo.uid,
        course_id,
      })
      .count()

    return {
      code: 0,
      message: '查询成功',
      data: {
        total_count: res.total,
      },
    }
  },
  /**
   * 获取总打卡次数, 按照用户分组，统计每个用户打卡次数, 查询所有课程
   */
  getTotalCheckinCount: async function () {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const total = await db.collection('learning_records').where({ user_id: userInfo.uid }).count()

    return {
      code: 0,
      message: '获取成功',
      data: {
        totalCheckinCount: total.total,
      },
    }
  },
  /**
   * 获取过去一年日历热力图数据 获取过去一年每日打卡次数
   */

  getCalendarCheckinData: async function () {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid) return { code: 401, message: '请登录后操作' }

    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - 52 * 7)
    startDate.setHours(0, 0, 0, 0)

    const fromDate = new Date(startDate)
    fromDate.setDate(fromDate.getDate() - fromDate.getDay()) // 补齐到周日开始

    const res = await db
      .collection('learning_records')
      .where({
        user_id: userInfo.uid,
        date: db.command.gte(fromDate),
      })
      .get()

    // 统计每天的 count
    const countMap = {}
    res.data.forEach((item) => {
      const key = formatDate(item.date)
      countMap[key] = (countMap[key] || 0) + 1
    })

    // 构造 DayData[][] 结构
    const weeks = []
    const cursor = new Date(fromDate)

    for (let w = 0; w < 53; w++) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const key = formatDate(cursor)
        week.push({
          date: key,
          count: countMap[key] || 0,
        })
        cursor.setDate(cursor.getDate() + 1)
      }
      weeks.push(week)
    }

    return {
      code: 0,
      message: '获取成功',
      data: weeks,
    }
  },
}

/**
 * 工具方法：格式化为 YYYY-MM-DD 的 Date 对象（0点）
 */
function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}T00:00:00.000Z`
}
