/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/1/27 22:24
 * @Description:
 */
export default class SeaonInfo {
  public season: number
  public name: string
  public count: number

  constructor (seaon: number, name: string, count: number = 1) {
    this.season = seaon
    this.name = name
    this.count = count
  }

}
