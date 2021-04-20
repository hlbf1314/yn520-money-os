/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/3/11 23:04
 * @Description:
 */
export default class TableUtils {
  public static getColumnsTitleWidth (): number {
    return Math.min(180, document.body.offsetWidth * 0.15)
  }
}
