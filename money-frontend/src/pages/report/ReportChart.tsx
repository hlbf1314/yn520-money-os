import React, { SyntheticEvent } from 'react'
import { Checkbox, Modal } from 'antd'
import { Chart } from '@antv/g2'
import ReportStyle from './report.module.scss'

const CheckboxGroup = Checkbox.Group

interface ReportChartProps {
  chartData: ChartData
  closeCallback: () => void
}

interface ReportChartState {
  checkedList: Array<string>
}

export class ChartData {
  category: string = ''
  key: string = ''
  title: string = ''
  chartData: Array<{ season: string, value: number }> = []
}

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2021/3/16 08:20
 * @Description:
 */
export default class ReportChart extends React.Component<ReportChartProps, ReportChartState> {

  private _seasonOptions: Array<string> = [ '一季报', '中报', '三季报', '年报' ]
  private static SEASON_SIGN: Array<string> = [ 'Q1', 'Q2', 'Q3', 'Q4' ]
  private _chart: Chart | undefined

  constructor (props: ReportChartProps, context: any) {
    super(props, context)
    this.state = { checkedList: this._seasonOptions }
    this.onChange = this.onChange.bind(this)
    this.onSelectedAll = this.onSelectedAll.bind(this)
  }

  componentDidMount () {
    this.props.chartData.chartData.sort((a, b) => {
      if (a.season > b.season) {
        return 1
      }
      return -1
    })
    this.initChart()
    this.drawChart()
  }

  private season (season: string): string {
    const seasonList: Array<string> = season.split('-')
    return seasonList[0] + '-Q' + (Number(seasonList[1]) / 3 | 0)
  }

  private initChart (): void {
    const height = document.body.offsetHeight * 0.55
    this._chart = new Chart({
      container: 'chartId',
      autoFit: true,
      height
    })
  }

  private drawChart (): void {
    if (!this._chart) return
    const data = []
    const seasons: Array<string> = this.state.checkedList.map(value => {
      for (let i = 0; i < this._seasonOptions.length; i++) {
        if (value === this._seasonOptions[i]) return ReportChart.SEASON_SIGN[i]
      }
      return ''
    })
    console.log('season name in chart ... ', seasons)
    const info: Array<{ season: string, value: number }> = this.props.chartData.chartData
    for (const chartDataKey in info) {
      const season = this.season(info[chartDataKey].season)
      let select = false
      for (const seasonValue of seasons) {
        if (season.includes(seasonValue)) {
          select = true
          break
        }
      }
      if (!select) continue
      data.push({ season, value: info[chartDataKey].value })
    }
    console.log('season in chart ... ', info, data)
    this._chart.data(data)
    this._chart.scale('value', { nice: true })

    this._chart.tooltip({ showMarkers: false })
    this._chart.interaction('active-region')
    this._chart.interval().position('season*value')
    this._chart.render()
  }

  private onChange (checkedList: Array<any>): void {
    this.setState({ checkedList }, () => {
      this.drawChart()
    })
  }

  private onSelectedAll (e: SyntheticEvent): void {
    this.onChange(this._seasonOptions)
  }

  render () {
    const { title } = this.props.chartData
    const width = document.body.offsetWidth * 0.9
    const visibility = this.state.checkedList.length > 0 ? 'initial' : 'hidden'
    return <Modal visible={true} closable={true} title={title} footer={[]} className={ReportStyle.reportChart}
                  onCancel={this.props.closeCallback} maskClosable={true} width={width}>
      <CheckboxGroup options={this._seasonOptions} value={this.state.checkedList} onChange={this.onChange} />
      <div id={'chartId'} style={{ marginTop: '10px', visibility }}></div>
      {this.state.checkedList.length === 0 &&
      <div className={ReportStyle.emptyTips}>请选择财报<a onClick={this.onSelectedAll}>全选</a></div>}
    </Modal>
  }
}
