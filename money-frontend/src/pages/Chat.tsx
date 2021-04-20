import React from 'react'
// @ts-ignore
import createG2 from 'g2-react'
import linedata from './data.json'

const Line = createG2((chart: { line: () => { (): any; new (): any; position: { (arg0: string): { (): any; new (): any; color: { (arg0: string): { (): any; new (): any; shape: { (arg0: string): { (): any; new (): any; size: { (arg0: number): void; new (): any; }; }; new (): any; }; }; new (): any; }; }; new (): any; }; }; render: () => void; }) => {
  chart.line().position('time*price').color('name').shape('spline').size(2)
  chart.render()
})

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/11 08:05
 * @Description:
 */
export default class Chat extends React.PureComponent<any, any> {
  constructor (p: any) {
    super(p)
    this.state = {
      data: linedata.slice(0, linedata.length / 2 - 1),
      width: 1500,
      height: 550,
      plotCfg: {
        margin: [ 10, 100, 50, 120 ]
      }
    }

  }

  render () {
    return <Line
      data={this.state.data}
      width={this.state.width}
      height={this.state.height}
      plotCfg={this.state.plotCfg}
      ref="myChart"
    />
  }
}
