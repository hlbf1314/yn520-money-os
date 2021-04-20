export default class ServiceProxy {
  static SUCCESS = 0

  static fetchPost (url: string, data = null) {
    let promise = new Promise((resolve, reject) => {
      const opts: any = {
        method: 'POST',
        credentials: 'include', // 没有这个，服务器写不入cookie，2019/02/19
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
      fetch(url, opts)
        .then((response) => {
          // 你可以在这个时候将Promise对象转换成json对象:response.json()
          // 转换成json对象后return，给下一步的.then处理
          return response.json()
        })
        .then((responseText) => {
          // this.verify(responseText)
          resolve(responseText)
        })
        .catch((error) => {
          console.error(error)
          reject(error)
        })
    })
    return promise
  }

  static async fetchGet (url: string, data = null) {
    return new Promise((resolve, reject) => {
      const opts: any = {
        method: 'GET',
        credentials: 'include'// 没有这个，服务器写不入cookie，2019/02/19
      }
      if (data) opts.data = JSON.stringify(data)
      fetch(url, opts).then((response) => {
        // 返回一个带有文本的对象
        console.log('fetch get response = ', response)
        return response.json()
      }).then((responseText) => {
        // this.verify(responseText)
        resolve(responseText)
      }).catch((error) => {
        console.error(error)
        reject(error)
      })
    })
  }

  /**
   *  成功才会返回
   *  @param url -- 请求url
   *  @param modelName -- 请求的模块名，用来错误/成功提示
   *  @param successTips -- 成功也直接提示，如果是false，不提示，需要业务逻辑来处理
   */
  static fetchGetOnlyOk (url: string, modelName: string, successTips = true, data = null, failTips = true) {
    return new Promise((resolve, reject) => {
      ServiceProxy.fetchGet(url, data).then((resp: any) => {
        // if (resp.code !== ServiceProxy.SUCCESS) {
        //   // if (failTips) {
        //   //   Modal.error({
        //   //     title: '错误',
        //   //     content: `${modelName}失败：${resp.message}`
        //   //   })
        //   // }
        // } else {
        //   if (successTips) {
        //     // Notice.info(
        //     //   {
        //     //     title: '提示',
        //     //     desc: `${modelName}成功`
        //     //   }
        //     // )
        //   }
        // }
        resolve(resp)
      }).catch(err => {
        if (failTips) {
          // Modal.error({
          //   title: '错误',
          //   content: `${modelName}失败：${err}`
          // })
        }
        reject(err)
      })
    })
  }

  /**
   *  成功才会返回
   *  @param url -- 请求url
   *  @param modelName -- 请求的模块名，用来错误/成功提示
   *  @param successTips -- 成功也直接提示，如果是false，不提示，需要业务逻辑来处理
   */
  static fetchPostOnlyOk (url: string, modelName: string, successTips = true, data = null) {
    return new Promise((resolve, reject) => {
      ServiceProxy.fetchPost(url, data).then((resp: any) => {
        if (resp.code !== ServiceProxy.SUCCESS) {
          // Modal.error({
          //   title: '错误',
          //   content: `${modelName}失败：${resp.message}`
          // })
        } else {
          // if (successTips) {
          //   Notice.info(
          //     {
          //       title: '提示',
          //       desc: `${modelName}成功`
          //     }
          //   )
          // }
          resolve(resp)
        }
      }).catch(err => {
        // Modal.error({
        //   title: '错误',
        //   content: `${modelName}失败：${err}`
        // })
        reject(err)
      })
    })
  }

  // static verify (response) {
  //   // if (response.code === ResultEnum.TOKEN_OVER_TIME) {
  //   //   localStorage.removeItem(AppUtils.LOCALESTORAGE_KYE_UID)
  //   //   router.push('/login')
  //   // }
  // }

  static async loadJsonFile (url: string) {
    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        // 返回一个带有文本的对象
        return response.json()
      }).then((responseText) => {
        // this.verify(responseText)
        resolve(responseText)
      }).catch((error) => {
        console.error('loadJsonFile error:', error)
        reject(error)
      })
    })
  }

  static async loadTxtFile (url: string) {
    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        // 返回一个带有文本的对象
        return response.text()
      }).then((responseText) => {
        // this.verify(responseText)
        resolve(responseText)
      }).catch((error) => {
        console.error('loadTxtFile error:', error)
        reject(error)
      })
    })
  }

}
