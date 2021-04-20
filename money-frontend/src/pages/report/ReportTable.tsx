import { Table } from 'antd'
import React from 'react'

interface ReportTableProps {
  fixedColumns: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number }>
  fixedData: Array<any>
  height: number
}

/**
 * @Auther: TimHuang
 * @tel: 15807663767
 * @Date: 2020/11/24 23:12
 * @Description:
 */
export default class ReportTable extends React.PureComponent<ReportTableProps, any> {
  render () {
    const { fixedColumns, fixedData, height } = this.props
    return <Table
      columns={fixedColumns}
      dataSource={fixedData}
      pagination={false}
      scroll={{ x: 180 + (fixedData.length - 1) * 5, y: height }}
      bordered
      onRow={record => {
        return {
          onClick: event => {
            // console.log('ReportTable~ , onClick', event, record)
          }, // 点击行
          onDoubleClick: event => {
            console.log('ReportTable~ , onDoubleClick', record)
            if (record.onSelect) {
              record.onSelect(event, Object.assign({}, record))
            }
          },
          onContextMenu: event => {
            // console.log('ReportTable~ , onContextMenu', event.clientX, record)
          },
          onMouseEnter: event => {
            // console.log('ReportTable~ , onMouseEnter', event)
          }, // 鼠标移入行
          onMouseLeave: event => {
            // console.log('ReportTable~ , onMouseLeave', event)
          }
        }
      }}
      // onHeaderRow={column => {
      //   return {
      //     onClick: (event) => {
      //       console.log('ReportTable~ , onHeaderRow click', event)
      //     } // 点击表头行
      //   }
      // }}
    />
  }
}
