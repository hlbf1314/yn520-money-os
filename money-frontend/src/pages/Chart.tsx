import React from 'react'
import * as G2 from '@antv/g2'
import ChartStyle from './chart.module.scss'

interface ChartState {
  position: { x: number, y: number }
  specailValue: number
}

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/11 09:43
 * @Description:
 */
export default class Chart extends React.PureComponent<any, ChartState> {
  private _containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  private chart: G2.Chart | undefined
  private _tipsRef: React.RefObject<HTMLDivElement> = React.createRef()

  constructor (p: any, s: ChartState) {
    super(p, s)
    this.state = { position: { x: 0, y: 0 }, specailValue: 0 }
  }

  componentDidMount () {
    // G2 初始化图形代码
    if (this._containerRef.current) {
      this.chart = new G2.Chart({
        // this.containerRef.current 即为引用
        container: this._containerRef.current,
        autoFit: false,
        height: 300,
        width: 600
      })
    }
    // 下文会介绍
    this.refreshChart()
  }

  render () {
    return (
      <div style={{ marginLeft: '10px' }} ref={this._containerRef}>
        <div ref={this._tipsRef} className={ChartStyle.g2LabelSpec}
             style={{ top: `${this.state.position.y - 34}px`, left: `${this.state.position.x - 100}px` }}
        >
          新产品上市破局，现金流<span className={ChartStyle.g2LabelSpecValue}> {this.state.specailValue} </span>亿
        </div>
      </div>
    )
  }

  private refreshChart () {
    if (!this.chart) return
    // 接收 data 属性作为数据源
    this.chart.data([
      { year: '2013', value: -3.1 },
      { year: '2014', value: 0.8 },
      { year: '2015', value: 2.3 },
      { year: '2016', value: 3.5 },
      { year: '2017', value: 5.4 }
    ])
    this.chart.scale('value', {
      alias: '现金流(亿)',
      nice: true
    })

    this.chart.axis('year', {
      tickLine: null
    })

    this.chart.axis('value', {
      label: null,
      title: {
        offset: 30
      }
    })

    this.chart.tooltip({
      showMarkers: false
    })
    this.chart.interaction('active-region')

    this.chart.legend(false)
    this.chart
      .interval()
      .position('year*value')
      .color('year', (val) => {
        if (val === '2013') {
          return '#36c361'
        }
        return '#ff5957'
      })
      .label('year*value', (year, value) => {
        return {
          content: (originData) => {
            if (originData.year === '2014') {
              this.setState({ specailValue: value })
              return null
            }
            return value
          }
        }
      })
    this.chart.render()

    const position = this.chart.getXY({ year: '2014', value: 0.8 })
    console.log('position = ', position)
    this.setState({ position })
    const chartContainer = this.chart.getCanvas().get('container')
    chartContainer.appendChild(this._tipsRef.current)
  }
}
