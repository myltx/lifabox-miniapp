const uniID = require('uni-id-common')

module.exports = {
  _before() {
    const clientInfo = this.getClientInfo()
    this.uniID = uniID.createInstance({ clientInfo })
  },

  // 添加物品
  async add(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)
    if (!uid) throw new Error('请先登录')

    const {
      name,
      category_id = '',
      description = '',
      image = '',
      expiry_date = '',
      remind_days_before = 0,
    } = params

    if (!name) throw new Error('名称不能为空')

    const now = new Date()
    const db = uniCloud.database()
    const res = await db.collection('items').add({
      user_id: uid,
      category_id,
      name,
      description,
      image,
      expiry_date,
      remind_days_before,
      created_at: now,
      updated_at: now,
    })

    return {
      code: 0,
      message: '添加成功',
      data: { item_id: res.id },
    }
  },

  // 获取物品列表
  async list(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    const {
      category_id = '',
      keyword = '',
      page = 1,
      pageSize = 20,
    } = params

    const db = uniCloud.database()
    const dbCmd = db.command
    const collection = db.collection('items')

    const query = { user_id: uid }

    if (category_id) query.category_id = category_id
    if (keyword) query.name = dbCmd.regex({ pattern: keyword, options: 'i' })

    const total = await collection.where(query).count()
    const list = await collection
      .where(query)
      .orderBy('created_at', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      message: '获取成功',
      data: {
        total: total.total,
        list: list.data,
      },
    }
  },

  // 更新物品
  async update(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    const { id, ...updates } = params
    if (!id) throw new Error('缺少物品 ID')

    const allowedFields = ['name', 'category_id', 'description', 'image', 'expiry_date', 'remind_days_before']
    const updateData = { updated_at: new Date() }

    allowedFields.forEach(field => {
      if (field in updates) {
        updateData[field] = updates[field]
      }
    })

    const db = uniCloud.database()
    const res = await db.collection('items')
      .where({ _id: id, user_id: uid })
      .update(updateData)

    return {
      code: 0,
      message: res.updated ? '更新成功' : '更新失败或无权限',
    }
  },

  // 删除物品
  async remove(params = {}) {
    const token = this.getUniIdToken()
    const { uid } = await this.uniID.checkToken(token)

    const { id } = params
    if (!id) throw new Error('缺少物品 ID')

    const db = uniCloud.database()
    const res = await db.collection('items')
      .where({ _id: id, user_id: uid })
      .remove()

    return {
      code: 0,
      message: res.deleted ? '删除成功' : '删除失败或无权限',
    }
  }
}
