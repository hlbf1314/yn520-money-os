import { makeAutoObservable } from 'mobx'

export class StockInfo {
  public symbol: string = ''
  public tsCode: string = ''
  public name: string = ''
  public area: string = ''
  public industry: string = ''
  public listDate: string = ''
  public startDate: string = ''
  public endDate: string = ''

  constructor (symbol: string = '', tsCode: string = '', name: string = '', area: string = '',
               industry: string = '', listDate: string = '', startDate: string = '', endDate: string = '') {
    this.symbol = symbol
    this.tsCode = tsCode
    this.name = name
    this.area = area
    this.industry = industry
    this.listDate = listDate
    this.startDate = startDate
    this.endDate = endDate
  }
}

export const ALL_INDUSTRY = '全部行业'

/**
 * @author huangjianbin
 * @date 2020-11-23 20:03
 * @telephone 15807663767
 */
class StockInfoStore {
  constructor () {
    makeAutoObservable(this)
  }

  stockInfoList: Array<StockInfo> = []

  setStockInfoList (value: Array<StockInfo>): void {
    this.stockInfoList = value
    const stockInfoDic: Record<string, StockInfo> = {}
    for (const stockInfo of value) {
      stockInfoDic[stockInfo.symbol] = stockInfo
    }
    this.setStockInfoDic(stockInfoDic)
    // console.log('this.stockInfoList = value ',
    //   this.stockInfoList, value
    // )
  }

  stockInfoDic: Record<string, StockInfo> = {}

  setStockInfoDic (value: Record<string, StockInfo>): void {
    this.stockInfoDic = value
  }

  updateStockInfoInDic (value: StockInfo): void {
    console.log('get on stock info by code before = ', this.stockInfoDic[value.symbol])
    this.stockInfoDic[value.symbol] = value
    console.log('get on stock info by code after = ', this.stockInfoDic[value.symbol])
  }

  updateOneStockInfo (value: StockInfo): boolean {
    for (let i = 0; i < this.stockInfoList.length; i++) {
      if (this.stockInfoList[i].symbol === value.symbol) {
        this.stockInfoList[i] = value
        return true
      }
    }
    return false
  }

  stockIndustryList: Array<string> = [ ALL_INDUSTRY ]

  setStockIndustryList (value: Array<string>): void {
    this.stockIndustryList = value
  }

  getStockInfoBySymbol (value: string): StockInfo | undefined {
    // for (const info of this.stockInfoList) {
    //   if (info.symbol === value) return info
    // }
    return this.stockInfoDic[value]
    // return undefined
  }

  jsonRecord: Record<string, string> = {}

  setJsonRecord (value: Record<string, string>) {
    this.jsonRecord = value
  }

  public getColumnsName (key: string) {
    return this.jsonRecord[key.toLocaleLowerCase()]
  }

}

const stockInfoStore: StockInfoStore = new StockInfoStore()
export default stockInfoStore
