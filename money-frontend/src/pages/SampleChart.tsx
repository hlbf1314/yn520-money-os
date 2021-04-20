import React from 'react'
import * as G2 from '@antv/g2'

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/11 09:43
 * @Description:
 */
export default class SampleChart extends React.PureComponent<any, any> {
  private _containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  private chart: G2.Chart | undefined

  componentDidMount () {
    // G2 初始化图形代码
    if (this._containerRef.current) {
      this.chart = new G2.Chart({
        // this.containerRef.current 即为引用
        container: this._containerRef.current,
        width: 450,
        height: 300
      })
    }
    // 下文会介绍
    this.refreshChart()
  }

  render () {
    return (
      <div ref={this._containerRef} />
    )
  }

  private refreshChart () {
    if (!this.chart) return
    // 接收 data 属性作为数据源
    this.chart.data([
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 1150 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Shooter2', sold: 3580 },
      { genre: 'Shooter3', sold: 345 },
      { genre: 'Shooter4', sold: 111 },
      { genre: 'Shooter5', sold: 5167 },
      { genre: 'Other', sold: 150 }
    ])
    // 此处为硬编码，配置源自 G2 官方示例： https://github.com/antvis/g2
    // 实际开发中需要封装，推荐直接使用 BizCharts。
    this.chart.interval().position('genre*sold').color('genre')
    this.chart.render()
  }
}
