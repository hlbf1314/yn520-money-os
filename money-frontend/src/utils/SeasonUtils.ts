import SeaonInfo from '../vo/SeasonInfo'

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/1/27 22:25
 * @Description:
 */
export default class SeasonUtils {
  //'一季报', '中报', '三季报', '年报', '最近一年', '最近两年'
  private static _seasonName: Array<SeaonInfo> = [
    new SeaonInfo(1, '一季报'),
    new SeaonInfo(2, '中报'),
    new SeaonInfo(3, '三季报'),
    new SeaonInfo(4, '年报')
  ]

  public static createSeasonList (count: number): Array<SeaonInfo> {
    count = Math.min(Math.max(count, 1), 4)
    const list: Array<SeaonInfo> = []
    const copy = this._seasonName.concat()
    for (let i = 0; i < count; i++) {
      const info = copy.pop()
      if (info) list.unshift(info)
    }
    list.push(new SeaonInfo(5, '最近一年', 4))
    list.push(new SeaonInfo(6, '最近两年', 8))
    list.push(new SeaonInfo(7, '全部', 0))
    console.log('create season list is ', list)
    return list
  }
}
