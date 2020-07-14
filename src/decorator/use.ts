import { RequestHandler } from 'express'
import 'reflect-metadata'
import {CrowllerController, LoginController} from '../controller'

export function use(middleware: RequestHandler) {
  return function(target: CrowllerController | LoginController, key: string) {
    // Reflect.defineMetadata('middleware', middleware, target, key)
    const originMiddleware = Reflect.getMetadata('middlewares', target, key) || []
    originMiddleware.push(middleware)
    Reflect.defineMetadata('middlewares', originMiddleware, target, key)
  }
}