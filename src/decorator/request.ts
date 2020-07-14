import {CrowllerController, LoginController} from '../controller'

export enum Methods {
  get = 'get',
  post = 'post'
}

/* 工厂函数，生成各种装饰器，如post,get,put... */
function getRequestDecorator(type: Methods) {
  return function(path: string) {
    return function(target: CrowllerController | LoginController, key: string) {
      Reflect.defineMetadata('path', path, target, key)
      Reflect.defineMetadata('method', type, target, key)
    }
  }
}

export const get = getRequestDecorator(Methods.get)
export const post = getRequestDecorator(Methods.post)
// export const put = getRequestDecorator('put')
