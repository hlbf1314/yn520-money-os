import { CloseOutlined, LeftSquareTwoTone, QuestionCircleOutlined } from '@ant-design/icons'
import { Badge, Button, Drawer, Modal, Space } from 'antd'
import React, { SyntheticEvent } from 'react'
import pkStore from '../../stores/PKStore'
import PKPreviewStyle from './report.module.scss'
import { observer } from 'mobx-react'
import { withRouter } from 'react-router'
import passportStore from '../../stores/PassportStore'

interface PKPreviewState {
  showDrawer: boolean
}

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/12/7 22:13
 * @Description:
 */
@observer
class PKPreview extends React.PureComponent<any, PKPreviewState> {
  constructor (props: any) {
    super(props)
    this.state = { showDrawer: false }
  }

  private onShowDrawer = () => {
    this.setState({ showDrawer: true })
  }

  private onClose = () => {
    this.setState({ showDrawer: false })
  }

  private deleteStock = (e: SyntheticEvent) => {
    const symbol: string = e.currentTarget.id
    const pkList = pkStore.pkList.concat()
    for (let i = 0; i < pkList.length; i++) {
      if (pkList[i].symbol === symbol) {
        pkList.splice(i, 1)
        break
      }
    }
    pkStore.setPKList(pkList)
    if (pkList.length === 0) this.onClose()
  }

  private deleteAllStock = () => {
    Modal.confirm({
      title: '清空对比列表',
      icon: <QuestionCircleOutlined />,
      content: '确定要清除对比列表？',
      okText: '确定',
      cancelText: '取消',
      onOk: this.doDeleteAllStock.bind(this)
    })
  }

  private doDeleteAllStock (): void {
    pkStore.setPKList([])
    this.onClose()
  }

  private gotoPkPage = () => {
    if (passportStore.loginStatus) {
      this.props.history.push('/pk')
      return
    }

    Modal.confirm({
      title: '跳转至PK页面',
      icon: <QuestionCircleOutlined />,
      content: '跳转后将 丢失本页面数据，确定跳转？',
      okText: '确定',
      cancelText: '取消',
      onOk: this.doGotoPkPage.bind(this)
    })
  }

  private doGotoPkPage (): void {
    passportStore.setShowLogin(true)
    // passportStore.setShowRegister(true)
    console.log('showLogin ', passportStore.showLogin)
    // this.props.history.push("/pk");
  }

  private preview (): React.ReactNode {
    return pkStore.pkList.length > 0 && !this.state.showDrawer ?
      <div className={PKPreviewStyle.pkPreview} onClick={this.onShowDrawer}>
        <Badge count={pkStore.pkList.length} offset={[ pkStore.pkList.length > 9 ? -35 : -30, 5 ]}>
          <LeftSquareTwoTone className={PKPreviewStyle.pkArrow} />
        </Badge>
      </div> : null
  }

  private drawer (): React.ReactNode {
    return <Drawer visible={this.state.showDrawer} onClose={this.onClose} title={'以下股票参与报表对比'}>
      {pkStore.pkList.map((value, index) => {
        return <div key={index} className={PKPreviewStyle.pkPreviewDrawer}>
          <span>{value.tsCode}({value.name})</span>
          <CloseOutlined id={value.symbol} className={PKPreviewStyle.closeOutlined} onClick={this.deleteStock} />
        </div>
      })}
      <Space align={'end'} style={{ marginTop: '10px' }}>
        <Button disabled={!pkStore.pkList.length} onClick={this.gotoPkPage}>对比</Button>
        <Button disabled={!pkStore.pkList.length} onClick={this.deleteAllStock}>清空</Button>
      </Space>

    </Drawer>
  }

  render () {
    return <>
      {this.preview()}
      {this.drawer()}
    </>
  }
}

export default withRouter(PKPreview)
