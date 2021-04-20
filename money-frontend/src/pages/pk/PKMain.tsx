import React, { RefObject } from 'react'
import pkStore from '../../stores/PKStore'
import { Button, Checkbox, message, Select } from 'antd'
import PKStyle from './pkmain.module.scss'
import SeaonInfo from '../../vo/SeasonInfo'
import SeasonUtils from '../../utils/SeasonUtils'
import { SearchOutlined } from '@ant-design/icons/lib'
import ServiceUrl from '../../service/ServiceUrl'
import ServiceProxy from '../../service/ServiceProxy'
import stockInfoStore from '../../stores/StockInfoStore'
import ReportStyle from '../report/report.module.scss'
import PKReportTable from './PKReportTable'
import TableUtils from '../../utils/TableUtils'

const { Option } = Select

interface PKMainState {
  yearList: Array<number>
  seasonList: Array<SeaonInfo>
  pkList: Array<string>
  tableColumns?: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number }>
  tableData?: Array<any>
  tableWidth?: number
  tableHeight?: number
}

interface PKMainProps {
}

/**
 * @author huangjianbin
 * @date 2020-12-09 20:07
 * @telephone 15807663767
 */
export default class PKMain extends React.PureComponent<PKMainProps, PKMainState> {
  private _columnWidth: number = 110

  constructor (p: PKMainProps) {
    super(p)
    let seasonList = SeasonUtils.createSeasonList(6)
    this.state = {
      yearList: [],
      pkList: [],
      seasonList,
      tableWidth: 500,
      tableHeight: 500
    }
  }

  componentDidMount () {
    const pkList = []
    for (const info of pkStore.pkList) {
      pkList.push(info.symbol)
    }
    this.setState({ pkList }, () => {
      this.countYearSelect()
    })
  }

  private countYearSelect (): void {
    console.log('countYearSelect: ', this.state.pkList)
    const yearList = []
    let startYear = 0
    let endYear = 9999
    for (const info of pkStore.pkList) {
      if (!this.state.pkList.includes(info.symbol)) continue
      const startY = Number(info.startDate.split('-')[0]) || 0
      const endY = Number(info.endDate.split('-')[0]) || 9999
      startYear = Math.max(startYear, startY)
      endYear = Math.min(endYear, endY)
    }
    for (let i = startYear; i <= endYear; i++) {
      yearList.unshift(i)
    }
    this.setState({ yearList })
  }

  private onSelectedStock = (e: any) => {
    console.log('change .... ', e)
    const id = e.target.id
    const checked = e.target.checked
    const pkList = this.state.pkList.concat()
    if (checked) {
      let isIn: boolean = false
      for (const stockInfo of pkList) {
        if (stockInfo !== id) continue
        isIn = true
        break
      }
      if (!isIn) {
        for (const info of pkStore.pkList) {
          if (info.symbol !== id) continue
          pkList.push(info.symbol)
          break
        }
      }
    } else {
      if (pkList.length < 3) {
        message.error('不能取消，至少选择两个！')
        return
      }
      for (let i = 0; i < pkList.length; i++) {
        if (pkList[i] !== id) continue
        pkList.splice(i, 1)
        break
      }
    }
    console.log('将要比较。。。。。', pkList)
    this.setState({ pkList }, () => {
      this.countYearSelect()
    })
  }

  private onSelectedReportTypeHandler = (value: string) => {
    console.log(`selected ReportType : ${value}`)
    // this.setSelectedInfoParam({ type: value })
    this._reportType = value
  }

  private onSelectedYearHandler = (value: number) => {
    console.log(`selected Year : ${value}`)
    // this.setSelectedInfoParam({ type: value })
    this._year = value
  }
  private onSelectedSeasonHandler = (value: any) => {
    console.log(`selected Season : ${value}`)
    this._season = value
    // this.setSelectedInfoParam({ type: value })
  }

  private _season: number = 0
  private _year: number = 0
  private _reportType: string = ''

  private _seasonRef: RefObject<any> = React.createRef()
  private _yearRef: RefObject<any> = React.createRef()
  private _reportRef: RefObject<any> = React.createRef()

  private reqStockReport (): void {
    console.log('reqStockReport ', this.state.pkList, this._yearRef.current.props.defaultValue)
    const year = this._year || this._yearRef.current.props.defaultValue
    const season = this._season || this._seasonRef.current.props.defaultValue
    const reportType = this._reportType || this._reportRef.current.props.defaultValue
    if (season > 4) {
      let count = 4
      if (season === 6) {
        // 最近两年
        count = 8
      } else if (season === 7) {
        // 全部
        count = 0
      }
      this.getMultiplePkSeasons(reportType, count)
    } else {
      this.getOnePkSeason(reportType, year, season)
    }
  }

  private getOnePkSeason (type: number, year: number, season: number): void {
    const url = ServiceUrl.getReportUrl(
      `pkSeason?stockCodeList=${this.state.pkList}&type=${type}&year=${year}&season=${season}`
    )
    ServiceProxy.fetchGet(url)
      .then((resp: any) => {
        console.log('report is ', resp)
        if (resp.code === 0 && resp.data) {
          // this.setState({ protoError: '' })
          const tableData: Array<any> = []
          const tableColumns: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number }> = []
          this.createOnReport(resp.data.report, tableData, tableColumns)
          this.setState({ tableColumns, tableData })
          console.log('tableData~ ', tableData, tableColumns)
        } else {
          // this.setState({ protoError: resp.message || '网络忙，请稍后再试。' })
        }
      })
      .catch((e) => {
        console.error('report fail ', e.message)
      })
  }

  private getMultiplePkSeasons (type: number, count: number): void {
    const url = ServiceUrl.getReportUrl(
      `pkSeasons?stockCodeList=${this.state.pkList}&type=${type}&count=${count}`
    )
    ServiceProxy.fetchGet(url)
      .then((resp: any) => {
        console.log('pk reports is ', resp)
        if (resp.code === 0 && resp.data) {
          // this.setState({ protoError: '' })
          // let tableColumnList: any[] = []
          let tableData: any[] = []
          const tableColumnList: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number }> = []
          for (let i = 0; i < resp.data.report.length; i++) {
            this.createOnReport(resp.data.report, tableData, tableColumnList, i)
            // tableColumnList = tableColumnList.concat(tableColumns)
          }
          console.log('table all info = ', tableColumnList, tableData)
          this.setState({ tableColumns: tableColumnList, tableData })
        } else {
          // this.setState({ protoError: resp.message || '网络忙，请稍后再试。' })
        }
      })
      .catch((e) => {
        console.error('report fail ', e.message)
      })
  }

  private pkList (): React.ReactNode {
    return (
      <div style={{ textAlign: 'center' }}>
        {pkStore.pkList.map((value, index) => {
          return (
            <Checkbox
              key={'pk_stock_' + index}
              defaultChecked={true}
              checked={this.state.pkList.includes(value.symbol)}
              id={value.symbol}
              onChange={this.onSelectedStock}
              style={{ float: 'left' }}
            >
              {value.name}
            </Checkbox>
          )
        })}
      </div>
    )
  }

  private pkContent (): React.ReactNode {
    return (
      <div className={PKStyle.pkItemCommon}>
        <div>
          <span className={PKStyle.reportType}>报表类型：</span>
          <Select
            defaultValue="100"
            style={{ float: 'left' }}
            ref={this._reportRef}
            onChange={this.onSelectedReportTypeHandler}
          >
            <Option value="100">利润表</Option>
            <Option value="110">资产负债表</Option>
            <Option value="120">现金流量表</Option>
          </Select>
          <Select
            showSearch
            style={{ float: 'left' }}
            placeholder="年份"
            optionFilterProp="children"
            ref={this._yearRef}
            key={this.state.yearList.length > 0 ? this.state.yearList[0] : undefined}
            defaultValue={this.state.yearList.length > 0 ? this.state.yearList[0] : undefined}
            onChange={this.onSelectedYearHandler}
          >
            {this.state.yearList.map((value) => {
              return (
                <Option value={value} key={value}>
                  {value}
                </Option>
              )
            })}
          </Select>
          <Select
            showSearch
            ref={this._seasonRef}
            style={{ float: 'left' }}
            placeholder="选择季度"
            optionFilterProp="children"
            defaultValue={1}
            onChange={this.onSelectedSeasonHandler}
          >
            {this.state.seasonList.map((value, index) => {
              // const disabled = this.isIPOYear && value.season <= this.state.ipoTime.season
              return (
                <Option value={value.season} key={'season' + index}>
                  {value.name}
                </Option>
              )
            })}
          </Select>
          <Button
            style={{ float: 'left' }}
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => {
              this.reqStockReport()
            }}
          >
            获取
          </Button>
        </div>
      </div>
    )
  }

  private onDoubleClickHandler (e: any, record: any): void {
    console.log('ReportMain~', e, record)

  }

  private createOnReport (reportList: Array<any>, tableDataList: Array<any>, tableColumns: Array<any>, index: number = 0) {
    // const tableColumns: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number, onSelect?: (e: any, r: any) => void, children?: any[] }> = []
    // const tableDataList = []
    // 开始解析单条数据
    for (const reportElement of reportList) {
      /*
      {
        "stockCode": "000001",
        "type": 100,
        "count": 1,
        "year": 0,
        "season": 0,
        "report":{}   //注意这里
      }
       */
      const report = reportElement.report //
      const stockCode = reportElement['stockCode']
      if (Array.isArray(report)) {
        console.log('It is Array ', stockCode, report)
        for (const oneReport of report) {
          this.parseOnData(oneReport, stockCode, tableColumns, tableDataList, index)
        }
      } else {
        this.parseOnData(report, stockCode, tableColumns, tableDataList, index)
      }
    }
    if (index === 0) {
      tableColumns.unshift({
        title: '',
        dataIndex: 'title',
        fixed: true,
        width: TableUtils.getColumnsTitleWidth()
      })
    }
    console.log('table one info = ', tableColumns)
    return tableColumns
  }

  private parseOnData (report: any, stockCode: string, tableColumns: any, tableDataList: Array<any>, index: number) {
    const json = stockInfoStore.jsonRecord
    let dataTitle = ''
    let i = 0
    for (const key in report) {
      if (key.toLocaleLowerCase() === 'reportdate') {
        dataTitle = report[key]
        let hasExit = false
        for (const column of tableColumns) {
          if (column['title'] === dataTitle) {
            hasExit = true
            break
          }
        }
        if (hasExit) continue
        const children = []
        for (const value of this.state.pkList) {
          const dataIndex = dataTitle + '_' + value
          for (const info of pkStore.pkList) {
            if (info.symbol !== value) continue
            const pkInfo = { title: info.name, dataIndex, width: this._columnWidth }
            children.push(pkInfo)
          }
        }
        console.log('加入头：', dataTitle)
        tableColumns.push({
          title: dataTitle,
          dataIndex: dataTitle,
          width: this._columnWidth,
          onSelect: this.onDoubleClickHandler.bind(this),
          children
        })
      } else {
        if (tableDataList.length > i) {
          tableDataList[i][dataTitle + '_' + stockCode] = report[key] || '--'
        } else {
          const title = json[key.toLocaleLowerCase()]
          let hasData = false
          for (const record of tableDataList) {
            if (record['title'] === title) {
              hasData = true
              record[dataTitle + '_' + stockCode] = report[key] || '--'
              break
            }
          }

          if (!hasData) {
            let data: any = {
              key: index + '' + dataTitle + '_' + i,
              title,
              category: key,
              onSelect: this.onDoubleClickHandler.bind(this)
            }
            data[dataTitle + '_' + stockCode] = report[key] || '--'
            tableDataList.push(data)
          }
        }
        i++
      }
    }
  }

  render () {
    const { tableData, tableColumns } = this.state
    return (
      <div className={PKStyle.pkMain}>
        {this.pkList()}
        {this.pkContent()}
        {!tableData ? null :
          <div className={ReportStyle.tableContainer}>
            <PKReportTable fixedColumns={tableColumns || []} fixedData={tableData} height={this.state.tableHeight} />
          </div>
        }
      </div>
    )
  }
}
