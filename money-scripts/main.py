# -*- coding: utf-8 -*
import os
import time
import pymysql
import platform

import FinaceReportCreater
import FinanceReportDownload
import JsonCreater
import StockInfo
import TimeUtil


def createFolder(folderName):
    if not os.path.exists(folderName):
        os.makedirs(folderName)
        print('create folder [{}] successfully!'.format(folderName))
    else:
        print('folder [{}] is exist!'.format(folderName))


def createReportUrl(sign):
    return 'http://quotes.money.163.com/service/' + sign + '_%name%.html'


def createDB(dbName, dbcursor):
    try:
        createDBSentence = "create database if not exists " + dbName
        dbcursor.execute(createDBSentence)
        dbcursor.execute("use " + dbName + ";")
        # print('create db', dbName, ' successfully!')
    except Exception as e:
        print('create db {} fail , e={}'.format(dbName, e))


def getReportAndCreate(reportStockList, loadReportUrl, suffixName, filePath, reportCursor, reportDB):
    loadReportPath = filePath + suffixName + '_%name%' + '.csv'
    FinanceReportDownload.downloadReport(reportStockList, loadReportUrl, loadReportPath)

    createDB('finance_report_' + suffixName, reportCursor)
    createResult = FinaceReportCreater.createReport(filePath, reportCursor, reportDB, reportStockList, suffixName)
    titleDict = createResult['titleDict']
    # jsonFileDic2.append(stockDateInfoList)
    if suffixName == 'income':
        stockDateInfoList = createResult['stockDateInfoList']
        allStockInfoDateList.extend(stockDateInfoList)
    jsonFileDic.update(titleDict)

    # print("json文件合并：{}".format(jsonFileDic))


def creatReport(reportList, urlName, fileName, reportName, cursor, db, takeTimeLog):
    createReportStartTime = time.time()
    createTimeStr = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    print('\n{} : creating {} {} reports....'.format(createTimeStr, len(reportList), reportName))
    cashStatementUrl = createReportUrl(urlName)
    cashStatementFilePath = fileName + '/'
    getReportAndCreate(reportList, cashStatementUrl, reportName, cashStatementFilePath, cursor, db)
    createReportTakesTime = TimeUtil.takesTimeLog(round(time.time() - createReportStartTime), takeTimeLog)
    createReportEndTime = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    print('{} : all {} reports have created! {}'.format(createReportEndTime, reportName, createReportTakesTime))


def createAllStocksFile(stockList, allStockInfoDateList, jsonPath):
    jsonList = ""
    for insertList in stockList:
        symbol = insertList[1]
        tmp = ""
        try:
            tmp = ','.join(insertList)
        except Exception as e:
            for errValue in insertList:
                if tmp:
                    tmp += ','
                if not errValue:
                    tmp += '未知'
                else:
                    tmp += errValue
            print("try to str error : ", e, insertList, tmp)
        for info in allStockInfoDateList:
            code = info['code']
            s = info["start_date"]
            e = info["end_date"]
            if code == symbol:
                tmp += "," + s + "," + e
        fux = (jsonList != "") and ";" or ""
        testList = tmp.split(",")
        if len(testList) < 8:
            print("{}没有时间，从服务器中读取".format(symbol))
            tmp += ",2004-12-31,2012-12-31"
        jsonList += fux + tmp

    print("all stock file contents is : first={}, last={}".format(jsonList[0], jsonList[len(jsonList) - 1]))
    JsonCreater.createFile(jsonList, jsonPath + "all_stocks.txt")


def createAllStocksFileSimple(stockList, jsonPath):
    jsonList = getAllStocksFileSimple(stockList)
    JsonCreater.createFile(jsonList, jsonPath + "all_stocks.txt")


def getAllStocksFileSimple(stockList):
    jsonList = ""
    for insertList in stockList:
        print("on stock info is ", insertList)
        industry = (not insertList[4]) and "N" or insertList[4]
        tmp = insertList[0] + "," + insertList[2] + "," + industry
        fux = (jsonList != "") and ";" or ""
        jsonList += fux + tmp

    print("all stock file contents is : first={}, last={}".format(jsonList[0], jsonList[len(jsonList) - 1]))
    return jsonList


startTime = time.time()
isWindow = platform.system().count("Windows") > 0 or platform.system().count("windows") > 0
jsonPath = isWindow and 'jsons/' or '/usr/share/nginx/html/mainpage/jsons/'
reportPath = isWindow and './' or '/root/py/'
print("platform.system is {} , isWindow={} , jsonPath={}".format(platform.system(), isWindow, jsonPath))
takeTimeLog = 'it takes {} hours {} minutes {} seconds'
createFolder(jsonPath)
allStockInfoDateList = []
jsonFileDic = {}

incomeFileName = reportPath + 'income_statements'
createFolder(incomeFileName)
time.sleep(1)

balanceSheetFolderName = reportPath + 'balance_sheet'
createFolder(balanceSheetFolderName)
time.sleep(1)

cashStatementFileName = reportPath + 'cash_statement'
createFolder(cashStatementFileName)
time.sleep(1)

host = '192.168.43.140'
name = 'root'
password = '123456'
db = pymysql.connect(host, name, password, charset='utf8')
cursor = db.cursor()

createDB('stock_info', cursor)
stockList = StockInfo.createStockDB(cursor, db)
if len(stockList) == 0:
    stockList = StockInfo.getAllStockSymbol()
stockSymbols = []
for insertList in stockList:
    stockSymbols.append(insertList[1])
createAllStocksFileSimple(stockList, jsonPath)
# createAllStocksFile(stockList, allStockInfoDateList, jsonPath)
loadList = stockSymbols
loadList = stockSymbols[0:1]  # 测试，只要一个
stockLen = len(loadList)
print('there are {} stockSymbols :'.format(stockLen))

creatReport(loadList, 'lrb', incomeFileName, 'income', cursor, db, takeTimeLog)

time.sleep(1)

creatReport(loadList, 'zcfzb', balanceSheetFolderName, 'balance', cursor, db, takeTimeLog)

time.sleep(1)

creatReport(loadList, 'xjllb', cashStatementFileName, 'cash', cursor, db, takeTimeLog)

StockInfo.insertDate(allStockInfoDateList, cursor, db)
allStockInfo = getAllStocksFileSimple(stockList)
# jsonFileDic["allStockInfo"] = allStockInfo
JsonCreater.createJson(jsonFileDic, jsonPath + "report_title.json")

startTimeLocal = time.localtime(startTime)
print('\napplication starts at ', time.strftime("%Y-%m-%d %H:%M:%S", startTimeLocal))
print('application ends   at ', time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
print(TimeUtil.takesTimeLog(round(time.time() - startTime), takeTimeLog))
