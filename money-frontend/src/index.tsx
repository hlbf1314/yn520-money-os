import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import 'antd/dist/antd.css'
import { Route, Router } from 'react-router'

import { createBrowserHistory } from 'history'
import ReportMain from './pages/report/ReportMain'
import ReportLogic from './logic/ReportLogic'
import PKMain from './pages/pk/PKMain'
import PopLayer from './pages/pop/PopLayer'
import SampleChart from './pages/SampleChart'

const h = createBrowserHistory()

ReportLogic.instance.init()

ReactDOM.render(
  <Router history={h}>
    <Route exact path="/" component={ReportMain} />
    <Route path="/pk" component={PKMain} />
    <Route path="/chart" component={SampleChart} />
  </Router>,
  document.getElementById('root')
)

ReactDOM.render(<PopLayer />, document.getElementById('popup'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
