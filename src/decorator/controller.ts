import router from '../router'
import {RequestHandler} from 'express'
import {Methods} from './request'

export function controller(root: string) {
  return function(target: new (...args: any[]) => any) {
    for (let key in target.prototype) {
      // 打印get中定义的path元数据
      // console.log(Reflect.getMetadata('path', target.prototype, key))
      /* 生成路由, 保存到router中 */
      const path: string = Reflect.getMetadata('path', target.prototype, key)  // 路径
      const method: Methods = Reflect.getMetadata('method', target.prototype, key)  // 请求方式
      const middlewares: RequestHandler[] = Reflect.getMetadata('middlewares', target.prototype, key)  // 中间件
      const handler = target.prototype[key]  // 方法
      if (path && method) {
        const fullPath = root === '/' ? path : `${root}${path}`

        if (middlewares && middlewares.length) {
          router[method](fullPath, ...middlewares, handler)
        } else {
          // router.get(path, handler)
          router[method](fullPath, handler)
        }
        
      }
    }
  }
}

