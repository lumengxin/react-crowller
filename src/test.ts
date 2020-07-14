// ts 引用 js， 通过.d.ts翻译 npm install @types/superagent -D
import superagent from 'superagent'
import cheerio from 'cheerio'
// const {readFile, writeFile} = require('fs')
import fs from 'fs'
import path from 'path'

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

class Crowller {
  // private secret = 'secretKey'
  // private url = `http://127.0.0.1:3000/typescript/test-crowller.html?secret=${this.secret}`
  // private url = `http://www.baidu.com/`
  private url = `https://www.99csw.com/`
  private filePath = path.resolve(__dirname, '../data/test.json')


  /* saveRawHtml(crowHtml: string) {
    return new Promise((resolve, reject) => {
      writeFile('crowHtml.html', crowHtml, (err: string) => {
        if (!err) {
          console.log('文件保存成功.')
          resolve()
        } else {
          reject('保存失败' + err)
        }
      })
    })
  } */

  getCourseInfo(html: string) {
    const courseInfo: Course[] = []

   /*  const $ = cheerio.load(html)
    const bookBox = $('.hotsearch-item')
   
    bookBox.map((index, element) => {
      const descs = $(element).find('span')
      const rank = parseInt(descs.eq(0).text(), 10)
      const title = descs.eq(1).text()
      courseInfo.push({rank, title})
    }) */

    return {
      time: new Date().getTime(),
      data: courseInfo
    }
  }

  async getRawHtml() {
    // url中不能有空格或换行
    const result = await superagent.get(this.url)
    return result.text

    // this.saveRawHtml(result.text)
  }

  generateJsonContent(courseInfo: CourseResult) {
    let fileContent: Content = {}
    if (fs.existsSync(this.filePath)) {
      fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf8'))
    }
    fileContent[courseInfo.time] = courseInfo.data
    return fileContent
  }

  writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  async initSpiderProcess() {
    const html = await this.getRawHtml()
    const courseInfo = this.getCourseInfo(html)
    console.log("Crowller -> initSpiderProcess -> courseInfo", courseInfo)
    const fileContent = this.generateJsonContent(courseInfo)
    this.writeFile(JSON.stringify(fileContent))
  }

  constructor() {
    this.initSpiderProcess()
  }
}

const crowller = new Crowller()


/* 1.指定元素生成pdf */
// const browser = await puppeteer.launch();
// const page = await browser.newPage();
// await page.goto('https://www.google.com/', {waitUntil: 'networkidle2'});
// const dom = await page.$eval('div.jsb', (element) => {
//      return element.innerHTML
// }) // Get DOM HTML
// await page.setContent(dom)   // HTML markup to assign to the page for generate pdf
// await page.pdf(options)

/* 2.将jquery注入puppeteer页面 */
// import { launch } from 'puppeteer'
// (async () => {
//     const browser = await launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto('https://example.com', {waitUntil: 'networkidle'});
//     await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});
//     await page.close();
//     await browser.close();
// })();

// await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
// const title = await page.evaluate(() => {
//   const $ = window.$; //otherwise the transpiler will rename it and won't work
//   return $('h1 > span').text();
// });