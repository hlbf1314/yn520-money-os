https://ant.design/components/overview-cn/
https://g2.antv.vision/zh/

jsonPath:
http://www.yn520.com.cn/money/jsons/income/income_000001.json


router:  
    mobx --   https://www.npmjs.com/package/mobx-react-router
       Usage
       ---------------------------------  index.js ---------------------------
       import React from 'react';
       import ReactDOM from 'react-dom';
       import createBrowserHistory from 'history/createBrowserHistory';
       import { Provider } from 'mobx-react';
       import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
       import { Router } from 'react-router';
       import App from './App';
       const browserHistory = createBrowserHistory();
       const routingStore = new RouterStore();
       const stores = {
         // Key can be whatever you want
         routing: routingStore,
         // ...other stores
       };
       const history = syncHistoryWithStore(browserHistory, routingStore);
       ReactDOM.render(
         <Provider {...stores}>
           <Router history={history}>
             <App />
           </Router>
         </Provider>,
         document.getElementById('root')
       );
       --------------------------   App.js ------------------------ 
       import React, { Component } from 'react';
       import { inject, observer } from 'mobx-react';
       @inject('routing')
       @observer
       export default class App extends Component {
         private doGotoPkPage():void{
             const { push } = this.props.routing;
             push("/pk");
           }
       }
       
       
router:   react原生  不能用mobx的 @observer


const str='123 456 789\n789 000 111\n222 333 444'
console.log(str)

const parentList=str.split('\n')
console.log(parentList)
const result = []
for(const item of parentList){
    const itemList = item.split(' ')
    console.log("itemList is " , itemList)
    result.push(itemList)
}
console.log('result is ',result)
