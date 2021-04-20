import React, { RefObject } from 'react'
import { Button, Form, Input, message, Modal, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons/lib'
import ServiceProxy from '../../service/ServiceProxy'
import ServiceUrl from '../../service/ServiceUrl'
import passportStore from '../../stores/PassportStore'
import { observer } from 'mobx-react'

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/10 23:06
 * @Description:
 */
@observer
export default class Register extends React.Component<any, any> {
  private formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  }
  private tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  }

  private onFinish = (values: any) => {
    console.log('Received values of form: ', values)
    ServiceProxy.fetchPost(ServiceUrl.getRegisterUrl(), values).then((resp: any) => {
      if (resp.code === 0) {
        message.success('注册成功')
        passportStore.setShowLogin(true)
      } else {
        message.error(resp.message || '注册失败')
      }
    })
  }
  private onFinishFail = (values: any) => {
    console.log('Received fail values of form: ', values)
  }

  private onCaptchaHandler = () => {
    const err: string[] = this._formRef.current.getFieldError('email')
    console.log('error is ', err)

    if (err && err.length > 0) {
      message.error(err[0])
      return
    }
    const formData = this._formRef.current.getFieldValue()
    console.log('formData is ', formData)
    const email = formData['email']
    if (!email) {
      message.error('请输入您的电子邮箱')
      return
    }

  }
  private _formRef: RefObject<any> = React.createRef()

  private onCloseHandler = () => {
    passportStore.setShowRegister(false)
  }

  private gotoLogin = () => {
    passportStore.setShowLogin(true)
  }

  // 自定义样式  https://blog.csdn.net/wyk304443164/article/details/68484305
  render () {
    if (!passportStore.showRegister) return null
    return <Modal visible={passportStore.showRegister} title={'注册'} footer={[]}
                  onCancel={this.onCloseHandler} maskClosable={false}>
      <Form
        ref={this._formRef}
        {...this.formItemLayout}
        name="register"
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFail}
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            {
              type: 'email',
              message: '邮箱格式不对'
            },
            {
              required: true,
              message: '请输入您的邮箱'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入您 的密码'
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={[ 'password' ]}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请输入确认密码'
            },
            ({ getFieldValue }) => ({
              validator (rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('两次密码输入不一致')
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="userName"
          label={
            <span>
            昵称&nbsp;
              <Tooltip title="昵称，用来显示">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          }
          rules={[ { required: true, message: '请输入昵称!', whitespace: true } ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号码"
          rules={[ { required: true, message: '请输入您的手机号码' } ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>


        {/*<Form.Item label="验证码" extra="We must make sure that your are a human.">*/}
        {/*  <Row gutter={8}>*/}
        {/*    <Col span={12}>*/}
        {/*      <Form.Item*/}
        {/*        name="captcha"*/}
        {/*        noStyle*/}
        {/*        rules={[ { required: true, message: '请输入您收到的验证码' } ]}*/}
        {/*      >*/}
        {/*        <Input />*/}
        {/*      </Form.Item>*/}
        {/*    </Col>*/}
        {/*    <Col span={12}>*/}
        {/*      <Button onClick={this.onCaptchaHandler}>获取验证码</Button>*/}
        {/*    </Col>*/}
        {/*  </Row>*/}
        {/*</Form.Item>*/}

        {/*<Form.Item*/}
        {/*  name="agreement"*/}
        {/*  valuePropName="checked"*/}
        {/*  rules={[*/}
        {/*    {*/}
        {/*      validator: (_, value) =>*/}
        {/*        value ? Promise.resolve() : Promise.reject('Should accept agreement')*/}
        {/*    }*/}
        {/*  ]}*/}
        {/*  {...this.tailFormItemLayout}*/}
        {/*>*/}
        {/*  <Checkbox>*/}
        {/*    I have read the <a href="">agreement</a>*/}
        {/*  </Checkbox>*/}
        {/*</Form.Item>*/}
        <Form.Item {...this.tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
          <div style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.gotoLogin}>登录</div>
        </Form.Item>
      </Form>
    </Modal>
  }
}
