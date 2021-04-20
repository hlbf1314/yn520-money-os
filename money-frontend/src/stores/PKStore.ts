import { makeAutoObservable } from 'mobx'
import { StockInfo } from './StockInfoStore'

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/7 21:09
 * @Description:
 */
class PKStore {
  constructor () {
    makeAutoObservable(this)
  }

  pkList: Array<StockInfo> = []

  setPKList (value: Array<StockInfo>): void {
    this.pkList = value
  }

  public getPKStockInfo (symbol: string): StockInfo | undefined {
    for (const stockInfo of this.pkList) {
      if (stockInfo.symbol === symbol) return stockInfo
    }
    return undefined
  }
}

const pkStore = new PKStore()
export default pkStore
