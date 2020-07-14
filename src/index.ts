import express, {Request, Response, NextFunction} from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
// import router from './router'
// 使用控制器中运用修饰器生成的router
import './controller/LoginController'
import './controller/CrowllerController'
import router from './router'

const app = express()

// 问题1：express库的类型定义文件.d.ts文件类型描述不准确
// 问题2：使用中间件时，对req或者res做了修改后，实际上的类型并不能改变

// app.get('/', (req: Request, res: Response) => {
//   res.send('hello')
// })
// app.get('/getData', (req: Request, res: Response) => {
//   res.send('byb byb')
// })
app.use(bodyParser.urlencoded({ extended: false }))

// 自定义中间件。函数，接收三个参数
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'zhang'
  next()
})

app.use(
  cookieSession({
    name: 'session',
    keys: ['techer zhang'],
    maxAge: 24 * 3600 * 1000
  })
)

app.use(router)

app.listen(7001, () => {
  console.log('server is running at: http://localhost:7001')
})