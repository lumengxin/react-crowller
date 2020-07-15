import 'reflect-metadata'
import {Request, Response} from 'express'
import {controller, get, post} from '../decorator'
import {getResponseData} from '../utils/util'

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}

@controller('/api')
export class LoginController {
  // isLogin(req: BodyRequest): boolean {
  //   return !!(req.session ? req.session.login : false)
  // }
  static isLogin(req: BodyRequest): boolean {
    return !!(req.session ? req.session.login : false)
  }

  @get('/isLogin')
  isLogin(req: BodyRequest, res: Response): void {
    const isLogin = LoginController.isLogin(req)
    res.json(getResponseData(isLogin))
  }

  @post('/login')
  login(req: BodyRequest, res: Response): void{
    const {password} = req.body
    // const isLogin = !!(req.session ? req.session.login : false)
    // :'isLogin' of undefined. 类未被实例化，this指向不对
    // const isLogin = this.isLogin(req)
    const isLogin = LoginController.isLogin(req)

    if (isLogin && password === '123') {
      // res.json(getResponseData(false, '已经登录过'))
      res.json(getResponseData(true))
    } else {
      if (password === '123' && req.session) {
        req.session.login = true
        res.json(getResponseData(true))
      } else {
        res.json(getResponseData(false, '登录失败'))
      }
    }
  }

  @get('/logout')
  logout(req: BodyRequest, res: Response): void{
    if (req.session) {
      req.session.login = undefined
    }
    res.json(getResponseData(true))
  }

  @get('/')
  home(req: BodyRequest, res: Response): void{
    const isLogin = LoginController.isLogin(req)

    if (isLogin) {
      res.send(`
        <html>
          <body>
            <a href="/api/getData">爬取数据</a>
            <a href="/api/showData">展示数据</a>
            <a href="/api/logout">退出</a>
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