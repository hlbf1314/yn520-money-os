import { Button, Col, message, Row, Select, Spin } from 'antd'
import { BarChartOutlined, SearchOutlined } from '@ant-design/icons'
import React from 'react'
import ServiceProxy from '../../service/ServiceProxy'
import ReportStyle from './report.module.scss'
import stockInfoStore, { ALL_INDUSTRY, StockInfo } from '../../stores/StockInfoStore'
import { observer } from 'mobx-react'
import ReportTable from './ReportTable'
import { IReactionDisposer, reaction } from 'mobx'
import ServiceUrl from '../../service/ServiceUrl'
import PKLogic from '../../logic/PKLogic'
import PKPreview from './PKPreview'
import passportStore from '../../stores/PassportStore'
import SeaonInfo from '../../vo/SeasonInfo'
import SeasonUtils from '../../utils/SeasonUtils'
import TableUtils from '../../utils/TableUtils'
import ReportChart, { ChartData } from './ReportChart'
import CommonUtils from '../../utils/CommonUtils'

const { Option } = Select

interface ReportMainState {
  yearList: Array<number>
  seasonList: Array<SeaonInfo>
  ipoTime: { year: number, month: number, season: number }
  selectedInfo: { symbol: string | undefined, type: number, year: number, season: number, count: number }
  tableWidth: number
  tableHeight: number
  tableColumns?: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number }>
  tableData?: Array<any>
  protoError?: string,
  industry: string,
  showingStockList: Array<StockInfo>
  showingStock: StockInfo,
  chartData?: ChartData
}

/**
 * @author huangjianbin
 * @date 2020-11-21 08:10
 * @telephone 15807663767
 */
@observer
class ReportMain extends React.PureComponent<any, ReportMainState> {
  private _columnWidth: number = 110

  constructor (props: any, s: ReportMainState) {
    super(props, s)

    console.log('env=%s , businessUrl=%s , passportUrl=%s ', process.env, ServiceUrl.BUSINESS_URL, ServiceUrl.PASSPORT_URL)

    const selectedInfo = { symbol: undefined, type: 0, year: 0, season: 1, count: 1 }
    let seasonList = SeasonUtils.createSeasonList(6)
    const showingStockList = stockInfoStore.stockInfoList.concat()
    this.state = {
      yearList: [],
      seasonList,
      ipoTime: { year: 0, month: 0, season: 0 },
      selectedInfo,
      tableWidth: 500,
      tableHeight: 500,
      industry: ALL_INDUSTRY,
      showingStockList,
      showingStock: showingStockList[0] || new StockInfo()
    }
    reaction(() => this.state.showingStockList,
      (list) => {
        if (list.length > 0 && list[0] && list[0].symbol) this.asySelectedStock(list[0].symbol)
        // this.onSelectedStock(this.state.showingStockList[0])
      })
    reaction(() => this.state.tableColumns,
      (tableColumns) => {
        console.log('table Data change .... ', tableColumns && tableColumns.length)
        const len = (tableColumns && tableColumns.length) || 0
        if (len) {
          const tableWidth: number = 200 + this._columnWidth * (len - 1)
          this.setState({ tableWidth })
        }
      })

    // reaction(() => stockInfoStore.stockInfoList,
    //   () => {
    //     this.filteIndustryStocks()
    //   })
    reaction(() => passportStore.loginStatus,
      () => {
        console.log('登陆成功了?', passportStore.loginStatus)
        if (passportStore.loginStatus) {
          this.props.history.push('/pk')
        }
      })

    reaction(() => this.state.showingStock,
      () => {
        console.log('get on stock info by code ， this.state.showingStock change=', this.state.showingStock.symbol)
        this.stockInfoRection(this.state.showingStock.symbol)
      })

    this.bindHandlers()
  }

  private _showStockInfoReaction: IReactionDisposer | undefined

  private stockInfoRection (symbol: string): void {
    if (this._showStockInfoReaction) this._showStockInfoReaction()
    this._showStockInfoReaction = reaction(
      () => stockInfoStore.getStockInfoBySymbol(symbol),
      (stockInfo: StockInfo | undefined) => {
        console.log('get on stock info by code ，getStockInfoBySymbol reaction=', stockInfo)
        if (stockInfo?.symbol === this.state.showingStock.symbol) {
          this.onSelectedStock(stockInfo)
        }
      })
  }

  private bindHandlers (): void {
    this.closeChartHandler = this.closeChartHandler.bind(this)
  }

  componentDidMount () {
    if (stockInfoStore.stockInfoList.length > 0) this.filteIndustryStocks()
    reaction(() => stockInfoStore.stockInfoList,
      () => {
        this.filteIndustryStocks()
      })
    const h = document.body.offsetHeight - 200
    this.setState({ tableHeight: h })
  }

  private reqStockReport (): void {
    this.setState({ protoError: '数据请求中......' })
    this.setState({ tableData: undefined, tableColumns: undefined })
    const stockCode = this.state.selectedInfo.symbol
    const type = this.state.selectedInfo.type || 100
    if (this.state.selectedInfo.count !== 1) {
      this.getMultipleSeasons(stockCode, type, this.state.selectedInfo.count || 0)
    } else {
      const year = this.state.selectedInfo.year
      const season = this.state.selectedInfo.season || 1
      this.getOneSeason(stockCode, type, year, season)
    }
  }

  private getOneSeason (code: string | undefined, type: number, year: number, season: number): void {
    const url = ServiceUrl.getReportUrl(`season?stockCode=${code}&type=${type}&year=${year}&season=${season}`)
    ServiceProxy.fetchGet(url).then((resp: any) => {
      console.log('report is ', resp)
      if (resp.code === 0 && resp.data) {
        this.setState({ protoError: '' })
        const tableData: Array<any> = []
        const tableColumns = this.createOnReport(resp.data.report, tableData)
        this.setState({ tableColumns, tableData })
        console.log('tableData~ ', tableData)
      } else {
        this.setState({ protoError: resp.message || '网络忙，请稍后再试。' })
      }
    }).catch(e => {
      console.error('report fail ', e.message)
    })
  }

  private getMultipleSeasons (code: string | undefined, type: number, count: number): void {
    const url = ServiceUrl.getReportUrl(`seasons?stockCode=${code}&type=${type}&count=${count}`)
    ServiceProxy.fetchGet(url).then((resp: any) => {
      console.log('report is ', resp)
      if (resp.code === 0 && resp.data) {
        this.setState({ protoError: '' })
        let tableColumnList: any[] = []
        let tableData: any[] = []
        for (let i = 0; i < resp.data.report.length; i++) {
          const tableColumns = this.createOnReport(resp.data.report[i], tableData, i)
          tableColumnList = tableColumnList.concat(tableColumns)
          // console.log('bug ?? tableColumns , tableColumnList ， ' , tableColumns , tableColumnList)
        }
        tableData.sort((a, b) => {
          const aKey = CommonUtils.getNumberOnly(a.key) || 0
          const bKey = CommonUtils.getNumberOnly(b.key) || 0
          return aKey > bKey ? 1 : -1
        })
        for (const tableColumnListElement of tableColumnList) {
          const key = tableColumnListElement['dataIndex']
          for (const tableDatum of tableData) {
            if (tableDatum[key]) continue
            tableDatum[key] = '--'
          }
        }
        console.log('table all info = ', tableColumnList, tableData)
        this.setState({ tableColumns: tableColumnList, tableData })
      } else {
        this.setState({ protoError: resp.message || '网络忙，请稍后再试。' })
      }
    }).catch(e => {
      console.error('report fail ', e.message)
    })
  }

  private createOnReport (report: any, tableDataList: Array<any>, index: number = 0) {
    const tableColumns: Array<{ title: string, dataIndex: string, fixed?: boolean, width?: number, onSelect?: (e: any, r: any) => void }> = []
    // const tableDataList = []
    const json = stockInfoStore.jsonRecord
    let reportDateColumns: { title: string, dataIndex: string, fixed?: boolean, width?: number } = {
      title: '',
      dataIndex: ''
    }
    let dataTitle = ''
    const columnsTitleWidth: number = TableUtils.getColumnsTitleWidth()
    for (const key in report) {
      if (key.toLocaleLowerCase() === 'reportdate') {
        reportDateColumns = { title: '', dataIndex: 'title', fixed: true, width: columnsTitleWidth }
        dataTitle = report[key]
        tableColumns.unshift({
          title: dataTitle,
          dataIndex: dataTitle,
          width: this._columnWidth,
          onSelect: this.onDoubleClickHandler.bind(this)
        })
      } else {
        const dataKey = key

        /*
        查找是否已经有了这一行数据，如果有了，则在这一行数据中，能过dataTitle为key加入一个数据
        如果没有，则会创建新的一行数据，category为每行数据的标识
        */
        let exitIndex = -1
        for (let j = 0; j < tableDataList.length; j++) {
          if (tableDataList[j]['category'] === key) {
            exitIndex = j
            break
          }
        }

        if (exitIndex !== -1) { // 已经存在这一行数据，直接加数据
          tableDataList[exitIndex][dataTitle] = report[key] || '--'
        } else { // 还没有这一行数据，创建一行
          const data: any = {
            key: dataKey,
            // key: index + '' + dataTitle + '_' + i,
            title: json[key.toLocaleLowerCase()],
            category: key,
            onSelect: this.onDoubleClickHandler.bind(this)
          }
          data[dataTitle] = report[key] || '--'
          tableDataList.push(data)
        }
      }
    }
    if (index === 0) tableColumns.unshift(reportDateColumns)
    console.log('table one info = ', tableColumns)
    return tableColumns
  }

  private onDoubleClickHandler (e: any, record: any): void {
    const keys = Object.keys(record)
    console.log('ReportMain~', e, record, keys)
    if (keys.length > 5) {
      // delete record['onSelect']
      const chartData = new ChartData()
      // Object.assign(chartData, record)
      for (const chartDataKey in chartData) {
        // @ts-ignore
        if (record[chartDataKey]) chartData[chartDataKey] = record[chartDataKey]
      }
      const showingStock: StockInfo | undefined = stockInfoStore.getStockInfoBySymbol(this.state.selectedInfo.symbol || '')
      if (showingStock) {
        chartData.title = `${showingStock.name}(${showingStock.tsCode}) - ${chartData.title}`
      }
      for (const recordKey in record) {
        const isStr = typeof record[recordKey] === 'string'
        const isNum = typeof record[recordKey] === 'number'
        if (!(recordKey in chartData) && (isStr || isNum)) {
          const value = Number(record[recordKey]) || 0
          chartData.chartData.push({ season: recordKey, value })
        }
      }
      console.log('ReportMain~  chartData', chartData, record)
      this.setState({ chartData })
    } else {
      message.warn('单季度数据不能对比。')
    }
  }

  private filteIndustryStocks (industry: string = ''): void {
    if (!industry) industry = this.state.industry
    let list: Array<StockInfo> = []
    if (industry === ALL_INDUSTRY) {
      list = stockInfoStore.stockInfoList.concat()
    } else {
      for (const stockInfo of stockInfoStore.stockInfoList) {
        if (stockInfo.industry === industry) {
          list.push(stockInfo)
        }
      }
    }
    this.setState({ showingStockList: list })
  }

  private onSelectedIndustryHandler (value: string): void {
    this.setState({ industry: value })
    this.filteIndustryStocks(value)
  }

  private onSelectedStockHandler (value: string) {
    this.asySelectedStock(value)
  }

  private async asySelectedStock (value: string) {
    const showingStock: StockInfo | undefined = stockInfoStore.getStockInfoBySymbol(value)
    console.log('get on stock info by code asySelectedStock : ', showingStock)
    if (!showingStock || !showingStock?.listDate) {
      const url = ServiceUrl.stockInfoByCodeUrl(value)
      console.log('get on stock info by code protocol url~ ', url)
      ServiceProxy.fetchGet(url).then((resp: any) => {
        console.log('get on stock info by code protocol resp~ ', resp)
        if (resp.code === 0) {
          // stockInfoStore.updateOneStockInfo(resp.data)
          stockInfoStore.updateStockInfoInDic(resp.data)
        }
      })
    }
    console.log(`selected one stock : ${value} `, showingStock)
    if (showingStock) this.onSelectedStock(showingStock)
  }

  private onSelectedStock (showingStock: StockInfo) {
    const listDateList: Array<string> = String(showingStock?.startDate).split('-')
    const year: number = Number(listDateList[0])
    const month: number = Number(listDateList[1])
    const season: number = month / 3 - 1
    const yearList: Array<number> = []
    console.log(`selected one stock : year=${year} , month=${month}`, showingStock)
    const date = new Date()
    const endDate = showingStock.endDate
    const endYear = Number(endDate.split('-')[0]) || date.getFullYear()
    for (let i = year; i < endYear + 1; i++) {
      yearList.unshift(i)
    }
    this.setState({ yearList, ipoTime: { year, month, season }, showingStock })
    setTimeout(() => {
      this.setSelectedInfoParam({ symbol: showingStock.symbol })
    })
    this.onSelectedYearHandler(yearList[0])
  }

  private onSelectedReportTypeHandler (value: string): void {
    console.log(`selected ReportType : ${value}`)
    this.setSelectedInfoParam({ type: value })
  }

  private onSelectedYearHandler (year: number): void {
    console.log(`selected year : ${year}`)
    const season = this.getSeasonSelectDefault(year)
    this.setSelectedInfoParam({ year, season, count: 1 })
  }

  private onSelectedSeasonHandler (value: number): void {
    console.log(`selected season : ${value}`)
    let seaonTarget
    for (const seaonInfo of this.state.seasonList) {
      if (seaonInfo.season === value) {
        seaonTarget = seaonInfo
        break
      }
    }
    if (seaonTarget) this.setSelectedInfoParam(seaonTarget)
  }

  private setSelectedInfoParam (param: any): void {
    if (param.hasOwnProperty('season') && !param.hasOwnProperty('count')) {
      for (const seaonInfo of this.state.seasonList) {
        if (seaonInfo.season === param['season']) {
          param['count'] = seaonInfo.count
          break
        }
      }
    }
    const selectedInfo = { symbol: '', type: 0, year: 0, season: 1, count: 1 }
    Object.assign(selectedInfo, this.state.selectedInfo)
    Object.assign(selectedInfo, param)
    console.log('setSelectedInfoParam~ before=', this.state.selectedInfo, '  after=', selectedInfo)
    this.setState({ selectedInfo })
  }

  private getSeasonSelectDefault (year: number): number {
    let seasonDefault = this.state.seasonList.length > 0 ? this.state.seasonList[0].season : 0
    const isIPOYear = year === this.state.ipoTime.year
    if (isIPOYear) {
      for (const seaonInfo of this.state.seasonList) {
        if (seaonInfo.season > this.state.ipoTime.season) {
          seasonDefault = seaonInfo.season
          break
        }
      }
    }
    return seasonDefault
  }

  private get isIPOYear (): boolean {
    return this.state.selectedInfo.year === this.state.ipoTime.year
  }

  private addPkList (symbol: string): void {
    const stockInfo = stockInfoStore.getStockInfoBySymbol(symbol)
    if (stockInfo) {
      const industry = PKLogic.instance.addPKStockInfo(stockInfo)
      if (industry) {
        this.setState({ industry })
        this.filteIndustryStocks(industry)
      }
    }
  }

  private loading (): React.ReactNode {
    return <Spin style={{ margin: '50%' }} tip="Loading..." />
  }

  private closeChartHandler (): void {
    this.setState({ chartData: undefined })
  }

  render () {
    // if (stockInfoStore.stockInfoList.length === 0) return this.loading()
    const { tableData, tableColumns, protoError } = this.state
    return <>
      <div className={ReportStyle.reportMain}>
        {this.reportSelector()}
        {!protoError ? null : <span style={{ color: 'red', fontWeight: 900 }}>{protoError}</span>}
        {!tableData ? null :
          <div className={ReportStyle.tableContainer}>
            <ReportTable fixedColumns={tableColumns || []} fixedData={tableData} height={this.state.tableHeight} />
          </div>
        }
      </div>
      <PKPreview />
      {this.state.chartData && <ReportChart chartData={this.state.chartData} closeCallback={this.closeChartHandler} />}
    </>
  }

  private reportSelector (): React.ReactNode {
    // const stockTips = stockInfoStore.stockInfoList.length > 0 ? '选择或输入股票代号或名字' : '数据加载中......'
    const showStockValue = stockInfoStore.stockInfoList.length > 0 ? `${this.state.showingStock.tsCode}(${this.state.showingStock.name})` : undefined
    return <div className={ReportStyle.reportGetter}>
      <Row style={{ margin: '5px 0' }}>
        <Col span={3}> <span style={{ lineHeight: '32px' }}>股票:</span> </Col>
        <Col span={7}>
          <Select showSearch style={{ width: '100%' }} placeholder="行业" defaultValue={this.state.industry}
                  value={this.state.industry}
                  onChange={(value: string) => {
                    this.onSelectedIndustryHandler(value)
                  }}>{
            stockInfoStore.stockIndustryList.map(value => {
              return <Option value={value} key={'stock_industry_' + value}>{value}</Option>
            })
          }</Select>
        </Col>
        <Col span={14}>
          <Select showSearch style={{ width: '100%' }} placeholder={'数据加载中......'} optionFilterProp="children"
                  value={showStockValue}
                  onChange={(value: any) => {
                    this.onSelectedStockHandler(value)
                  }}
                  filterOption={(input, option) => {
                    if (option) {
                      const name = option.children.join('')
                      return name.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    return false
                  }}>
            {
              this.state.showingStockList.map((value) => {
                return <Option value={value.symbol} key={'stock_' + value.symbol}>{value.tsCode}({value.name})</Option>
              })
            }
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span={3}> <span style={{ lineHeight: '32px' }}>报表:</span> </Col>
        <Col span={8}>
          <Select defaultValue="100" style={{ width: '100%' }} disabled={!this.state.selectedInfo.symbol} onChange={(value: string) => {
            this.onSelectedReportTypeHandler(value)
          }}>
            <Option value="100">利润表</Option>
            <Option value="110">资产负债表</Option>
            <Option value="120">现金流量表</Option>
          </Select>
        </Col>

        <Col span={6}>
          <Select
            showSearch style={{ width: '100%' }} placeholder="年份" optionFilterProp="children" disabled={!this.state.selectedInfo.symbol}
            key={this.state.yearList.length > 0 ? this.state.yearList[0] : undefined}
            defaultValue={this.state.yearList.length > 0 ? this.state.yearList[0] : undefined}
            onChange={(value: number) => {
              this.onSelectedYearHandler(value)
            }}>
            {
              this.state.yearList.map(((value) => {
                return <Option value={value} key={value}>{value}</Option>
              }))
            }
          </Select>
        </Col>

        <Col span={7}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="选择季度"
            optionFilterProp="children"
            disabled={!this.state.selectedInfo.year}
            key={this.state.selectedInfo.season}
            defaultValue={this.state.selectedInfo.season}
            onChange={(value: number) => {
              this.onSelectedSeasonHandler(value)
            }}>
            {
              this.state.seasonList.map((value, index) => {
                const disabled = this.isIPOYear && value.season <= this.state.ipoTime.season
                return <Option value={value.season} key={'season' + index} disabled={disabled}>{value.name}</Option>
              })
            }
          </Select>
        </Col>
      </Row>
      <Row className={ReportStyle.searchBtn}>
        <Col span={14}>
          <Button style={{ width: '100%' }}
                  type="primary"
                  disabled={!this.state.selectedInfo.symbol}
                  icon={<SearchOutlined />} onClick={() => {
            this.reqStockReport()
          }}> 获取 </Button>
        </Col>
        <Col span={10}>
          <Button style={{ width: '100%' }}
                  disabled={!this.state.selectedInfo.symbol}
                  onClick={() => {
                    if (this.state.selectedInfo.symbol) this.addPkList(this.state.selectedInfo.symbol)
                  }}
                  icon={<BarChartOutlined />}>加入对比</Button></Col>
      </Row>

    </div>
  }
}

export default ReportMain
