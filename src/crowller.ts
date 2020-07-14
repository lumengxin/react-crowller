// ts 引用 js， 通过.d.ts翻译 npm install @types/superagent -D
import superagent from 'superagent'
import fs from 'fs'
import path from 'path'
import BaiduAnalytics from './analyzer/baiduAnalyzer'

export interface Analyzer {
  analyzer: (html: string, filePath: string) => string
}

class Crowller {
  private filePath = path.resolve(__dirname, '../data/course.json')

  private async getRawHtml() {
    const result = await superagent.get(this.url)
    return result.text
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.baiduAnalyzer.analyzer(html, this.filePath)
    this.writeFile(fileContent)
  }

  constructor(private url: string, private baiduAnalyzer: Analyzer) {
    this.initSpiderProcess()
  }
}

export default Crowller

// const url = `http://www.baidu.com/`

// // const baiduAnalyzer = new BaiduAnalytics()
// const baiduAnalyzer = BaiduAnalytics.getInstance()

// new Crowller(url, baiduAnalyzer)
