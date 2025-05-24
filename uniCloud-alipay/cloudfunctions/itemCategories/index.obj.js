const uniID = require('uni-id-common')

module.exports = {
  // 通用预处理器
  _before() {
    const clientInfo = this.getClientInfo()
    this.uniID = uniID.createInstance({ clientInfo })
  },

  // 添加分类
  async add(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    if (!uid) {
      throw new Error('请先登录')
    }

    const schema = {
      name: 'string',
      icon: { type: 'string', required: false },
      sort_order: { type: 'number', required: false },
    }
    this.middleware.validate(params, schema)

    const { name, icon = '', sort_order = 0 } = params
    const now = new Date()

    const db = uniCloud.database()
    const collection = db.collection('item_categories')

    const res = await collection.add({
      user_id: uid,
      name,
      icon,
      sort_order,
      created_at: now,
      updated_at: now,
    })

    return {
      code: 0,
      message: '分类添加成功',
      data: {
        category_id: res.id,
      },
    }
  },

  // 获取列表
  async list() {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    const db = uniCloud.database()
    const collection = db.collection('item_categories')

    const res = await collection
      .where({
        $or: [
          { user_id: uid }, // 用户自定义
          { user_id: '' },  // 系统默认
        ],
      })
      .orderBy('sort_order', 'asc')
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: res.data,
    }
  },

  // 更新分类
  async update(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    const { id, name, icon, sort_order } = params
    if (!id) throw new Error('缺少分类 ID')

    const db = uniCloud.database()
    const collection = db.collection('item_categories')

    const now = new Date()

    const updateData = {
      updated_at: now,
    }
    if (name !== undefined) updateData.name = name
    if (icon !== undefined) updateData.icon = icon
    if (sort_order !== undefined) updateData.sort_order = sort_order

    const res = await collection
      .where({
        _id: id,
        u
