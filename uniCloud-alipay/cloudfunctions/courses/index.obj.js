'use strict'
const uniID = require('uni-id-common')

module.exports = {
  /**
   * 通用预处理器
   */
  _before: async function () {
    const clientInfo = this.getClientInfo()
    this.uniID = uniID.createInstance({ clientInfo })
  },

  /**
   * 新增课程
   */
  add: async function (params = {}) {
    const db = uniCloud.database()
    const courseCollection = db.collection('courses')
    const courseInstanceCollection = db.collection('course_instances')

    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid || !token) return { code: 401, message: '用户未登录' }

    const {
      name,
      teacher_name = '',
      description,
      start_time,
      duration_weeks,
      weekdays = [],
    } = params

    if (!name || !description || !start_time || !duration_weeks || weekdays.length === 0) {
      return { code: 400, message: '请填写完整的课程信息' }
    }

    const startDate = new Date(start_time)
    const now = new Date()
    const schedule = []

    for (let week = 0; week <= duration_weeks; week++) {
      for (const weekday of weekdays) {
        const courseDate = new Date(startDate)
        const startDay = startDate.getDay()
        const offset = 7 * week + (weekday - startDay)
        courseDate.setDate(startDate.getDate() + offset)
        if (courseDate >= startDate) schedule.push(formatDate(courseDate))
      }
    }

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

    const courseInstances = course_schedule.map((course_date) => ({
      user_id: userInfo.uid,
      course_id: insertResult.id,
      course_date,
      name,
      teacher_name,
      created_at: now,
      updated_at: now,
    }))

    await courseInstanceCollection.add(courseInstances)

    return {
      code: 0,
      message: '课程创建成功',
      data: { course_id: insertResult.id },
    }
  },

  /**
   * 查询课程列表（分页）
   */
  list: async function (params = {}) {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid || !token) return { code: 401, message: '用户未登录' }

    const { page = 1, pageSize = 10 } = params

    const res = await db
      .collection('courses')
      .where({ user_id: userInfo.uid })
      .orderBy('created_at', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return { code: 0, message: '查询成功', data: res.data }
  },

  /**
   * 查询当天课程
   */
  today: async function () {
    const db = uniCloud.database()
    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid || !token) return { code: 401, message: '用户未登录' }

    const todayStr = formatDate(new Date())

    const res = await db
      .collection('course_instances')
      .where({ user_id: userInfo.uid, course_date: todayStr })
      .orderBy('course_date', 'asc')
      .get()

    return { code: 0, message: '查询成功', data: res.data }
  },

  /**
   * 修改课程
   */
  update: async function (params = {}) {
    const db = uniCloud.database()
    const courseCollection = db.collection('courses')
    const courseInstanceCollection = db.collection('course_instances')

    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid || !token) return { code: 401, message: '用户未登录' }

    const {
      _id,
      name,
      teacher_name = '',
      description,
      start_time,
      duration_weeks,
      weekdays = [],
    } = params

    if (!_id) return { code: 400, message: '缺少课程 ID' }

    const course = await courseCollection.doc(_id).get()
    if (!course.data || course.data[0].user_id !== userInfo.uid) {
      return { code: 403, message: '无权限或课程不存在' }
    }

    const startDate = new Date(start_time)
    const now = new Date()
    const schedule = []

    for (let week = 0; week < duration_weeks; week++) {
      for (const weekday of weekdays) {
        const courseDate = new Date(startDate)
        const startDay = startDate.getDay()
        const offset = 7 * week + (weekday - startDay)
        courseDate.setDate(startDate.getDate() + offset)
        if (courseDate >= startDate) schedule.push(formatDate(courseDate))
      }
    }

    const course_schedule = [...new Set(schedule)].sort()

    await courseCollection.doc(_id).update({
      name,
      teacher_name,
      description,
      start_time: startDate,
      duration_weeks,
      weekdays,
      course_schedule,
      updated_at: now,
    })

    await courseInstanceCollection
      .where({
        user_id: userInfo.uid,
        course_id: _id,
      })
      .remove()

    const courseInstances = course_schedule.map((course_date) => ({
      user_id: userInfo.uid,
      course_id: _id,
      course_date,
      name,
      teacher_name,
      created_at: now,
      updated_at: now,
    }))

    await courseInstanceCollection.add(courseInstances)

    return { code: 0, message: '课程修改成功' }
  },

  /**
   * 删除课程
   */
  remove: async function (params = {}) {
    const db = uniCloud.database()
    const courseCollection = db.collection('courses')
    const courseInstanceCollection = db.collection('course_instances')

    const token = this.getUniIdToken()
    const userInfo = await this.uniID.checkToken(token)
    if (!userInfo.uid || !token) return { code: 401, message: '用户未登录' }

    const { _id } = params
    if (!_id) return { code: 400, message: '缺少课程 ID' }

    const course = await courseCollection.doc(_id).get()
    if (!course.data || course.data[0].user_id !== userInfo.uid) {
      return { code: 403, message: '无权限或课程不存在' }
    }

    await courseCollection.doc(_id).remove()
    await courseInstanceCollection
      .where({
        course_id: _id,
        user_id: userInfo.uid,
      })
      .remove()

    return { code: 0, message: '课程删除成功' }
  },
}

/**
 * 日期格式化函数 YYYY-MM-DD
 */
function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
