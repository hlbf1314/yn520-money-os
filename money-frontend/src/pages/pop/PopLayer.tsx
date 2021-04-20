import React from 'react'
import Login from '../passport/Login'
import Register from '../passport/Register'

/**
 * @author huangjianbin
 * @date 2020-12-12 09:06
 * @telephone 15807663767
 */
export default class PopLayer extends React.PureComponent<any, any> {
render () {
  return <>
    <Login/>
    <Register/>
  </>
}
}
