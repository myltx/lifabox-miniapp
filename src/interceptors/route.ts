/**
 * by 菲鸽 on 2024-03-06
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore } from '@/store'
import { needLoginPages as _needLoginPages, getNeedLoginPages, getLastPage } from '@/utils'

// TODO Check
const loginRoute = '/pages/login/index' // 登录页路由

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  invoke({ url }: { url: string }) {
    const path = url.split('?')[0]
    const whiteListPages: string[] = [loginRoute]
    console.log('拦截器', path)

    // 判断当前页面是否在白名单中
    const isInWhiteList = whiteListPages.includes(path)

    if (isInWhiteList) {
      // 如果是白名单中的页面，不需要登录，直接允许访问
      return true
    }

    // 否则，检查是否已登录
    const hasLogin = isLogined()
    if (hasLogin) {
      // 已登录则可以访问
      return true
    }

    // 如果未登录，跳转到登录页并携带原页面地址
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
    uni.navigateTo({ url: redirectRoute })
    return false
  },
}
const navigateBackToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  invoke(data) {
    console.log(data, 'data')
    // ✅ 可在这里判断条件，决定是否继续执行
    // const allowBack = confirm('是否确定要返回上一页？')
    // if (!allowBack) {
    //   // ❌ 阻止 navigateBack 执行
    //   return false
    // }

    // ✅ 返回 true 或不返回，将继续执行 navigateBack
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
    uni.addInterceptor('navigateBack', navigateBackToInterceptor)
  },
}
