// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
module.exports = {
  _before: function () {
    // 通用预处理器
    const clientInfo = this.getClientInfo()
    this.uniID = uniID.createInstance({
      // 创建uni-id实例，其上方法同uniID
      clientInfo,
    })
  },
  add: async function (params = {}) {
    const db = uniCloud.database()
    const courseCollection = db.collection('courses')

    const token = this.getUniIdToken()
    console.log(token, 'token')

    const userInfo = await uniID.checkToken(token)
    console.log(userInfo, 'userInfo')
    const uid = this.authInfo.uid
    if (!uid) throw new Error('用户未登录')

    const schema = {
      name: 'string',
      teacher_name: {
        type: 'string',
        required: false,
      },
      description: 'string',
      start_time: 'date',
      duration_days: 'number',
      weekdays: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    }

    this.middleware.validate(params, schema)

    const { name, teacher_name = '', description, start_time, duration_days, weekdays } = params

    const startDate = new Date(start_time)
    const schedule = []

    for (let i = 0; i < duration_days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dayOfWeek = currentDate.getDay()
      if (weekdays.includes(dayOfWeek)) {
        schedule.push(formatDate(currentDate))
      }
    }

    const now = new Date()

    const insertResult = await courseCollection.add({
      user_id: uid,
      name,
      teacher_name,
      description,
      start_time: startDate,
      duration_days,
      weekdays,
      course_schedule: schedule,
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

function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
