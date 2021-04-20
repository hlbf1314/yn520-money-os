/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/7 21:14
 * @Description:
 */
import { StockInfo } from '../stores/StockInfoStore'
import pkStore from '../stores/PKStore'
import { message } from 'antd'

export default class PKLogic {
  private static _instance: PKLogic
  public static get instance (): PKLogic {
    if (!this._instance) this._instance = new PKLogic()
    return this._instance
  }

  public addPKStockInfo (value: StockInfo): string {
    const stockInfo: StockInfo | undefined = pkStore.getPKStockInfo(value.symbol)
    if (stockInfo) {
      message.error(`此股票【${stockInfo.tsCode}(${stockInfo.name})】已经存在对比列表中`)
      return ''
    } else if (pkStore.pkList.length > 0 && pkStore.pkList[0].industry !== value.industry) {
      message.error(`当前对比列表只接受【${pkStore.pkList[0].industry}】，清空对比列表或重新选择股票。`)
      return pkStore.pkList[0].industry
    }
    const record: Array<StockInfo> = pkStore.pkList.concat()
    record.push(value)
    pkStore.setPKList(record)
    return ''
  }

}
