/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/2 08:49
 * @Description:
 */
export default class ServiceUrl {
  public static BUSINESS_URL: string = process.env.REACT_APP_SER_BUSINESS || ''
  public static PASSPORT_URL: string = process.env.REACT_APP_SER_PASSPORT || ''
  public static CDN_URL: string = process.env.REACT_APP_CDN || ''

  public static getReportUrl (folder: string): string {
    return this.BUSINESS_URL + 'report/' + folder
  }

  public static get allStockInfoUrl (): string {
    return this.BUSINESS_URL + 'stock/all'
  }

  public static stockInfoByCodeUrl (code: string): string {
    return this.BUSINESS_URL + `stock/getStockByCode?code=${code}`
  }

  public static getRegisterUrl (): string {
    return this.PASSPORT_URL + 'user/register'
  }

  public static getLoginUrl (): string {
    return this.PASSPORT_URL + 'user/login'
  }

}
