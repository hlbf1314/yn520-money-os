import React from 'react'
import { Button, Checkbox, Form, Input, message, Modal } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons/lib'
import { observer } from 'mobx-react'
import passportStore from '../../stores/PassportStore'
import ServiceProxy from '../../service/ServiceProxy'
import ServiceUrl from '../../service/ServiceUrl'

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/10 23:06
 * @Description:
 */
@observer
export default class Login extends React.Component<any, any> {

  private onFinish = (values: string[]) => {
    console.log('Success:', values)
    let loginUrl: string = ServiceUrl.getLoginUrl() + '?'
    for (const key in values) {
      loginUrl += `${key}=${values[key]}&`
    }
    loginUrl.substring(0, loginUrl.length - 1)
    ServiceProxy.fetchGet(loginUrl).then((resp: any) => {
      if (resp.code === 0) {
        message.success('登陆成功')
        passportStore.setShowLogin(false)
        passportStore.setLoginStatus(true)
      } else {
        message.error(resp.message || '登陆失败')
        passportStore.setLoginStatus(false)
      }
    })
  }

  private onCloseHandler = () => {
    passportStore.setShowLogin(false)
  }

  private gotoRegister = () => {
    passportStore.setShowRegister(true)
  }

  // 自定义样式  https://blog.csdn.net/wyk304443164/article/details/68484305
  render () {
    if (!passportStore.showLogin) return null
    return <Modal visible={passportStore.showLogin} title={'登录'} footer={[]} width={'400px'}
                  onCancel={this.onCloseHandler} maskClosable={false}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
        style={{ padding: '0 20px' }}
      >
        <Form.Item
          name="userName"
          rules={[ { required: true, message: '请输入帐号' } ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="帐号" />
        </Form.Item>
        <Form.Item
          name="pwd"
          rules={[ { required: true, message: '请输入密码' } ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住帐号</Checkbox>
          </Form.Item>

          {/*<a style={{ float: 'right' }} href="">*/}
          {/*  忘记密码*/}
          {/*</a>*/}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
          <div style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.gotoRegister}>注册</div>
        </Form.Item>
      </Form>
    </Modal>
  }
}
