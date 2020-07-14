import cheerio from 'cheerio'
import fs from 'fs'
import { Analyzer } from '../crowller'

interface Course {
  rank: number
  title: string
}
interface CourseResult {
  time: number
  data: Course[]
}
interface Content {
  [propName: number]: Course[]
}

export default class BaiduAnalyzer implements Analyzer {
  private static instance: BaiduAnalyzer

  // 单例模式
  static getInstance() {
    if (!BaiduAnalyzer.instance) {
      BaiduAnalyzer.instance = new BaiduAnalyzer()
    }
    return BaiduAnalyzer.instance
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html)
    const bookBox = $('.hotsearch-item')

    const courseInfo: Course[] = []

    bookBox.map((index, element) => {
      const descs = $(element).find('a > span')
      const rank = parseInt(descs.eq(0).text(), 10)
      const title = descs.eq(1).text()
      console.log("BaiduAnalyzer -> getCourseInfo -> title",rank, title)
      courseInfo.push({rank, title})
    })
  
    return {
      time: new Date().getTime(),
      data: courseInfo
    }
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {}
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  public analyzer(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html)
    const fileContent = this.generateJsonContent(courseInfo, filePath)
    return JSON.stringify(fileContent)
  }

  private constructor() {}
}