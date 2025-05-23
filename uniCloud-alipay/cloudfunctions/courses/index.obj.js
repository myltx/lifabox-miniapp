'use strict'
const uniID = require('uni-id-common')
module.exports = {
  /**
   * 通用预处理器
   */
  _before: async function () {
    const clientInfo = this.getClientInfo()
    // 如果你启用了 uni-id 认证，可以在此处初始化
    this.uniID = uniID.createInstance({ clientInfo })
  },

  /**
   * 新增课程
   */
  add: async function (params = {}) {
    const db = uniCloud.database()
    const courseCollection = db.collection('courses')

    // 获取用户 Token
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    console.log(userInfo, 'token')

    if (!userInfo.uid || !token) {
      return {
        code: 401,
        message: '用户未登录，请先登录',
      }
    }
    console.log(params, 'params')
    const {
      name,
      teacher_name = '',
      description,
      start_time,
      duration_weeks,
      weekdays = [],
    } = params

    if (!name || !description || !start_time || !duration_weeks || weekdays.length === 0) {
      return {
        code: 400,
        message: '请填写完整的课程信息',
      }
    }

    const startDate = new Date(start_time)
    const now = new Date()

    // 计算课程排期
    const schedule = []
    for (let week = 0; week < duration_weeks; week++) {
      for (let i = 0; i < weekdays.length; i++) {
        const weekday = weekdays[i]
        const courseDate = new Date(startDate)
        const startDay = startDate.getDay()

        const daysOffset = 7 * week + (weekday - startDay)
        courseDate.setDate(startDate.getDate() + daysOffset)

        // 如果课程开始后才开始添加
        if (courseDate >= startDate) {
          schedule.push(formatDate(courseDate))
        }
      }
    }

    // 去重 + 排序
    const course_schedule = [...new Set(schedule)].sort()

    const insertResult = await courseCollection.add({
      user_id: userInfo.uid,
      name,
      teacher_name,
      description,
      start_time: startDate,
      duration_weeks,
      weekdays,
      course_schedule,
      created_at: now,
      updated_at: now,
    })

    return {
      code: 0,
      message: '课程创建成功',
      data: {
        course_id: insertResult.id,
      },
    }
  },
}

/**
 * 日期格式化函数
 * @param {Date} date
 * @returns {string} YYYY-MM-DD 格式字符串
 */
function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
