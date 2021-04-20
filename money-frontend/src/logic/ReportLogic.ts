/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/23 23:43
 * @Description:
 */
import ServiceProxy from '../service/ServiceProxy'
import stockInfoStore, { ALL_INDUSTRY, StockInfo } from '../stores/StockInfoStore'
import ServiceUrl from '../service/ServiceUrl'

export default class ReportLogic {
  private static _instance: ReportLogic
  public static get instance (): ReportLogic {
    if (!this._instance) this._instance = new ReportLogic()
    return this._instance
  }

  // constructor () {
  //   reaction(() => passportStore.loginStatus,
  //     () => {
  //       if (passportStore.loginStatus) {
  //         this.props.history.push('/child02')
  //       }
  //     })
  //
  // }

  public async init () {
    // this.reqAllStocks()
    this.reqAllStocksTxt()
    this.reqReportTitleJsons()
  }

  private reqReportTitleJsons (): void {
    const url = ServiceUrl.CDN_URL + 'jsons/report_title.json'
    console.log('all report_title.json req ', url)
    ServiceProxy.loadJsonFile(url).then((resp: any) => {
      console.log('all report_title.json back ', resp)
      const record: Record<string, string> = {}
      for (const respKey in resp) {
        const newKey = respKey.replace('_', '')
        record[newKey.toLocaleLowerCase()] = resp[respKey]
      }
      console.log('all jsons change ', record)
      stockInfoStore.setJsonRecord(record)
    })
  }

  private reqAllStocksTxt (): void {
    // 简洁版 -- 80K -- 0.4~0.6s
    // 全量版 -- 280K -- 1.8~2.5s
    const url = ServiceUrl.CDN_URL + 'jsons/all_stocks.txt'
    console.log('all all_stocks.txt req ', url)
    ServiceProxy.loadTxtFile(url).then((txt: any) => {
      const stockStrList: Array<string> = String(txt).split(';')
      console.log('all all_stocks.txt back ', stockStrList[0])
      /**
       area: "深圳"
       endDate: "2020-12-31"
       industry: "银行"
       listDate: "19910403"
       name: "平安银行"
       startDate: "2004-12-31"
       symbol: "000001"
       tsCode: "000001.SZ"
       */
      const list: Array<StockInfo> = []
      const industryList: Array<string> = [ ALL_INDUSTRY ]
      for (const stockStr of stockStrList) {
        const socketInfoList = stockStr.split(',')
        const tsCode = socketInfoList[0]
        const symbol = tsCode.toLocaleLowerCase().replace('.sz', '').replace('.sh', '')
        const stockName = socketInfoList.length > 1 ? socketInfoList[1] : ''
        const industry = socketInfoList.length > 2 ? socketInfoList[2] : ''
        const info = new StockInfo(symbol, tsCode, stockName, "", industry, '', '', '')
        list.push(info)
        if (!industryList.includes(info.industry)) industryList.push(info.industry)
      }
      stockInfoStore.setStockInfoList(list)
      stockInfoStore.setStockIndustryList(industryList)
    })
  }

  private reqAllStocks () {
    const url = ServiceUrl.allStockInfoUrl
    console.log('请求所有投票基本信息：', url)
    ServiceProxy.fetchGet(url).then((resp: any) => {
      console.log('请求所有投票基本信息~返回：', resp)
      if (resp.code === 0 && resp.data) {
        const list: Array<StockInfo> = []
        const industryList: Array<string> = [ ALL_INDUSTRY ]
        for (const value of resp.data) {
          const info = new StockInfo(value.symbol, value.tsCode, value.name, value.area, value.industry, value.listDate, value.startDate, value.endDate)
          list.push(info)
          if (!industryList.includes(info.industry)) industryList.push(info.industry)
        }
        stockInfoStore.setStockInfoList(list)
        stockInfoStore.setStockIndustryList(industryList)
      }
    }).catch(e => {
      console.error('report fail ', e.message)
    })
  }

}
