import 'reflect-metadata'
import {Router, Request, Response, NextFunction} from 'express'
import {controller, get} from './decorator'
import {getResponseData} from '../utils/util'

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}

// function get(path: string) {
//   return function(target: any, key: string) {
//     Reflect.defineMetadata('path', path, target, key)
//   }
// }

// function controller(target: any) {
//   for (let key in target.prototype) {
//     console.log(Reflect.getMetadata('path', target.prototype, key))
//   }
// }

@controller
class LoginController {
  @get('/logout')
  logout(req: BodyRequest, res: Response) {
    if (req.session) {
      req.session.login = undefined
    }
    res.json(getResponseData(true))
  }

  @get('/')
  home(req: BodyRequest, res: Response) {
    const isLogin = req.session ? req.session.login : false

    if (isLogin) {
      res.send(`
        <html>
          <body>
            <a href="/getData">爬取数据</a>
            <a href="/showData">展示数据</a>
            <a href="/logout">退出</a>
          </body>
        </html>
      `)
    } else {
      res.send(`
        <html>
          <body>
            <form method="post" action="/login">
              <input type="password" name="password" />
              <button>提交</button>
            </form>
          </body>
        </html>
      `)
    } 
  }
}