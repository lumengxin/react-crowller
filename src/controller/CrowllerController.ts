import 'reflect-metadata'
import {Request, Response, NextFunction} from 'express'
import fs from 'fs'
import path from 'path'
import {controller, use, get} from '../decorator'
import {getResponseData} from '../utils/util'
import Crowller from '../crowller'
import BaiduAnalytics from '../analyzer/baiduAnalyzer'

interface BodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
  // isLogin: any -> boolean
  const isLogin = !!(req.session ? req.session.login : false)
  console.log('checkLogin middleware')
  if (isLogin) {
    next()
  } else {
    res.json(getResponseData(null, '请先登录'))
  }
}

const test = (req: Request, res: Response, next: NextFunction): void => {
  console.log('test middleware')
  next()
}

// @controller('/abc') // localhost:7001/abc/showData
@controller('/api')
export class CrowllerController {

  @get('/getData')
  @use(checkLogin)
  getData(req: BodyRequest, res: Response): void {
    const url = `http://www.baidu.com/`
    const baiduAnalyzer = BaiduAnalytics.getInstance()
    new Crowller(url, baiduAnalyzer)
    res.json(getResponseData(true))
  }

  @get('/showData')
  // 'middleware'元数据会被覆盖
  @use(test)
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void{
    try {
      const position = path.resolve(__dirname, '../../data/course.json')
      const result = fs.readFileSync(position, 'utf8')
      res.json(getResponseData(JSON.parse(result)))
    } catch (err) {
      res.json(getResponseData(false, '尚未爬取到内容'))
    }
  }

}