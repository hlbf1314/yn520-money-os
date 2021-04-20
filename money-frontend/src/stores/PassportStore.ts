/**
 * @author huangjianbin
 * @date 2020-12-12 08:37
 * @telephone 15807663767
 */
import { makeAutoObservable } from 'mobx'

class PassportStore {
  constructor () {
    makeAutoObservable(this)
  }

  public showLogin: boolean = false

  public setShowLogin (value: boolean): void {
    this.showLogin = value
    if (this.showLogin && this.showRegister) this.setShowRegister(false)
  }

  public showRegister: boolean = false

  public setShowRegister (value: boolean): void {
    this.showRegister = value
    if (this.showLogin && this.showRegister) this.setShowLogin(false)
  }

  public loginStatus: boolean = false

  public setLoginStatus (value: boolean) {
    this.loginStatus = value
  }
}

const passportStore = new PassportStore()
export default passportStore
