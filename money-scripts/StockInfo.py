# -*- coding: utf-8 -*
import tushare
import time


def insertDate(stockDateInfoList, dbcursor, db):
    db.select_db('stock_info')
    dbcursor = db.cursor()
    for info in stockDateInfoList:
        code = info['code']
        s = info["start_date"]
        e = info["end_date"]
        insert = "update all_stock_info set start_date='%s', end_date='%s' where symbol='%s';" % (s, e, code)
        try:
            dbcursor.execute(insert)
            print('update all_stock_info successful : start_date={}, end_date={} where symbol={}'.format(s, e, code))
        except Exception as e:
            print('update [{}]fail : {}'.format(insert, e))
    db.commit()


def getAllStockDatas():
    pro = tushare.pro_api("2f20a99a8fbe17e858dee6caadd74fd318a7c2b3a720f19fe2d3ec64")
    # data = pro.stock_basic(exchange='', list_status='L', fields='ts_code,symbol,name,area,industry,list_date')
    data = pro.query('stock_basic', exchange='', list_status='L', fields='ts_code,symbol,name,area,industry,list_date')
    return data


def getAllStockSymbol():
    stockSymbols = []
    data = getAllStockDatas()
    for insertList in data.values:
        stockSymbols.append(insertList)
    return stockSymbols


def createStockDB(dbcursor, db):
    stockSymbols = []
    data = getAllStockDatas()
    tableName = 'all_stock_info'
    sqlIncomeTableTitle = "create table if not exists " + tableName + " ("
    insertTitle = ''
    for title in data.columns:
        primarykey = title == 'symbol' and ', primary key (' + title + ')' or ''
        sqlIncomeTableTitle += title + " VARCHAR(255)" + primarykey + ","
        insertTitle += title + ','
    # print('sqlIncomeTableTitle = ', sqlIncomeTableTitle)
    sqlIncomeTableTitle = sqlIncomeTableTitle[0: -1] + ", start_date  VARCHAR(255), end_date  VARCHAR(255)"
    sqlIncomeTableTitle += ") character set = utf8;"
    insertTitle = insertTitle[0: -1]
    # print('sqlIncomeTableTitle = ', sqlIncomeTableTitle)
    isWhole = False
    if dbcursor and db:
        try:
            dbcursor.execute(sqlIncomeTableTitle)
            isWhole = True
        except Exception as e:
            isWhole = False
            print('create table fail : ', e)
        try:
            curDate = time.strftime("%Y%m%d", time.localtime())
            for insertList in data.values:
                if insertList[len(insertList) - 1] < curDate and isWhole is False:
                    continue
                # print("insertList = ", insertList)
                insertSentence = "insert into " + tableName + " (" + insertTitle + ") values (\"" + '","'.join(
                    insertList) + "\")"
                # 获取的表中数据很乱，包含缺失值、Nnone、none等，插入数据库需要处理成空值
                sqlSentence4 = insertSentence.replace('nan', 'null').replace('None', 'null').replace('none', 'null')
                # print(sqlSentence4)
                dbcursor.execute(sqlSentence4)
                stockSymbols.append(insertList)
            db.commit()
            print("inserted all data !")
        except Exception as e:
            print('insert data fail : ', e)
    print('StockInfo done! insert ' + str(len(stockSymbols)) + ' rows!')
    return stockSymbols
# createStockDB(None, None)
