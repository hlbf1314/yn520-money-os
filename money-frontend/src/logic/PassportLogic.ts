/**
 * @author huangjianbin
 * @date 2020-12-12 08:40
 * @telephone 15807663767
 */

export default class PassportLogic {
  private static _instance: PassportLogic
  public static get instance (): PassportLogic {
    if (!this._instance) this._instance = new PassportLogic()
    return this._instance
  }
}
