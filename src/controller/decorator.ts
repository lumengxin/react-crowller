import { Router } from 'express'

export const router = Router()

enum Method {
  get = 'get',
  post = 'post'
}

/* 工厂函数，生成各种装饰器，如post,get,put... */
function getRequestDecorator(type: string) {
  return function(path: string) {
    return function(target: any, key: string) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const get = getRequestDecorator('get')
export const post = getRequestDecorator('post')
export const put = getRequestDecorator('put')

// export function get(path: string) {
//   return function(target: any, key: string) {
//     Reflect.defineMetadata('path', path, target, key)
//     Reflect.defineMetadata('method', 'get', target, key)
//   }
// }

// export function post(path: string) {
//   return function(target: any, key: string) {
//     Reflect.defineMetadata('path', path, target, key)
//     Reflect.defineMetadata('method', 'post', target, key)

//   }
// }

export function controller(target: any) {
  for (let key in target.prototype) {
    // 打印get中定义的path元数据
    // console.log(Reflect.getMetadata('path', target.prototype, key))
    /* 生成路由, 保存到router中 */
    const path = Reflect.getMetadata('path', target.prototype, key)  // 路径
    const method: Method = Reflect.getMetadata('method', target.prototype, key)  // 请求方式
    const handler = target.prototype[key]  // 方法
    if (path && method && handler) {
      // router.get(path, handler)
      router[method](path, handler)
    }
  }
}