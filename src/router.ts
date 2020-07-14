import {Router, Request, Response, NextFunction} from 'express'
import fs from 'fs'
import path from 'path'
import Crowller from './crowller'
import BaiduAnalytics from './analyzer/baiduAnalyzer'
import {getResponseData} from './utils/util'

interface RequestWithBody extends Request {
  body: {
    // password: string | undefined
    [key: string]: string | undefined
  }
}

// 验证是否登录的中间件
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false

  if (isLogin) {
    next()
  } else {
    // res.send('请先登录')
    res.json(getResponseData(null, '请先登录'))
  }
}

const router = Router()

router.get('/', (req: Request, res: Response) => {
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
})

router.get('/logout', (req: Request, res: Response) => {
  if (req.session) {
    req.session.login= undefined
  }
  // res.redirect('/')
  res.json(getResponseData(true))
})

router.post('/login', (req: RequestWithBody, res: Response) => {
  // 解析body,form表单需要借助express中间件body-parser
  const {password} =req.body
  const isLogin = req.session ? req.session.login : false
  // console.log("req.session", req.session)

  if (isLogin) {
    // res.send('已经登录过')
    res.json(getResponseData(false, '已经登录过'))
  } else {
    if (password === '123' && req.session) {
      req.session.login = true
      // res.send('登录成功')
      res.json(getResponseData(true))
    } else {
      // res.send('登录失败')
      res.json(getResponseData(false, '登录失败'))
    }
  }
})

router.get('/getData', checkLogin, (req: RequestWithBody, res: Response) => {
  // 解析body,form表单需要借助express中间件body-parser
  // const {password} =req.body
  /* const isLogin = req.session ? req.session.login : false

  if (isLogin) {
    const url = `http://www.baidu.com/`
    const baiduAnalyzer = BaiduAnalytics.getInstance()
    new Crowller(url, baiduAnalyzer)
    res.send('getData success')
  } else {
    res.send(`${req.teacherName}, 请登录后再爬取内容`)
  } */
  const url = `http://www.baidu.com/`
  const baiduAnalyzer = BaiduAnalytics.getInstance()
  new Crowller(url, baiduAnalyzer)
  // res.send('getData success')
  res.json(getResponseData(true))
})

router.get('/showData', checkLogin,  (req: RequestWithBody, res: Response) => {
  // const isLogin = req.session ? req.session.login : false

  // if (isLogin) {
    try {
      const position = path.resolve(__dirname, '../data/course.json')
      const result = fs.readFileSync(position, 'utf8')
      // res.json(JSON.parse(result))
      res.json(getResponseData(JSON.parse(result)))
    } catch (err) {
      // res.send('尚未爬取到内容\n' + err)
      res.json(getResponseData(false, '尚未爬取到内容'))
    }
  // } else {
  //   res.send('请登录后查看数据')
  //   // setTimeout(() => res.redirect('/login'), 2000)
  // }
  
})

export default router