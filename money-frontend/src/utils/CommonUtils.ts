/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/3/26 08:47
 * @Description:
 */
export default class CommonUtils {
  public static getNumberOnly (value: string): number | undefined {
    const pattern = /\d+/g
    let item: RegExpExecArray | null
    let numberValue = ''
    while ((item = pattern.exec(value)) != null) {
      if (item) numberValue += item[0]
    }
    return Number(numberValue)
  }
}
