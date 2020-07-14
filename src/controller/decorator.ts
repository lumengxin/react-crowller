import { Router } from 'express'

export const router = Router()

export function get(path: string) {
  return function(target: any, key: string) {
    Reflect.defineMetadata('path', path, target, key)
  }
}

export function controller(target: any) {
  for (let key in target.prototype) {
    // 打印get中定义的path元数据
    // console.log(Reflect.getMetadata('path', target.prototype, key))
    /* 生成路由, 保存到router中 */
    const path = Reflect.getMetadata('path', target.prototype, key)  // 路径
    const handler = target.prototype[key]  // 方法
    if (path) {
      router.get(path, handler)
    }
  }
}