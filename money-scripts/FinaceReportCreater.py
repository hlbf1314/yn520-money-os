# -*- coding: utf-8 -*
import csv
import os


def createTableFunc(filepath, fName, cursor, db, insertTitle):
    titleDict = {}
    stockDateInfo = {'code': None, 'start_date': None, 'end_date': None}
    with open(filepath + fName, 'rt', encoding='gbk') as f:
        reader = csv.reader(f)
        columns = [row for row in reader]
        length = len(columns)
        # print('len is ', length)
        tableName = fName.replace('.csv', '')
        tableNameList = tableName.split('_')
        insertTitleHead = tableNameList[0]
        stockDateInfo['code'] = tableNameList[1]
        # print('\n......start create table [{}]......'.format(tableName))
        incomeTableCreateSentence = 'create table if not exists ' + tableName + " ("
        dataInsertList = []
        while len(columns[0]) > 0:
            # print('----------------------')
            dataList = []
            for index in range(length):
                # print('index=' + str(index) + ' , when columns[index] is None')
                tmp = columns[index]
                if len(tmp) == 0:
                    continue
                title = tmp.pop()
                title = title.replace(':', '：')
                dataList.append(title)
            if dataList[0]: dataInsertList.append(dataList)
        # print('dataInsertList ??? ', len(dataInsertList))
        titleList = dataInsertList.pop()
        # print('title list = ', titleList)
        # print('dataInsertList ??? ---', len(dataInsertList))
        dataInsertList.reverse()
        # print(dataInsertList)
        length = len(titleList)
        needInsertTitle = not insertTitle  # 还没有标题栏，则需要创建。有了的话就直接用，整个数据库只有一份表头
        # 创建title
        for index in range(length):
            chineseTitle = titleList[index]
            title = index == 0 and 'report_date' or (insertTitleHead + '_' + str(index))
            titleDict[title] = chineseTitle
            if needInsertTitle: insertTitle += title + (index != (length - 1) and ', ' or '')
            title += (index == 0 and (' VARCHAR(767), primary key (' + title + ')') or ' float')
            incomeTableCreateSentence += title + (index == (length - 1) and ')' or ', ')
        # print('sqlIncomeTableTitle = ', sqlIncomeTableTitle)
        # print('start create column for table [{}]......'.format(tableName))
        dataInsertListLen = len(dataInsertList)
        try:
            cursor.execute(incomeTableCreateSentence)
            print('create table{} successful! and insert {} datas'.format(tableName, dataInsertListLen))
        except Exception as e:
            print('create table{} fail : '.format(tableName), e)

        # print('insertTitle = ', insertTitle)
        # print('dataInsertList ??? ', dataInsertList[dataInsertListLen - 1])
        # print('start insert data into table [{}]......'.format(tableName))

    #########  创建所有数据 ##########
    for insertIndex in range(dataInsertListLen):
        if dataInsertList[insertIndex][0].strip() == '':
            continue
        insertSentence = "insert into " + tableName + " (" + insertTitle + ") values ("
        dataLen = len(dataInsertList[insertIndex])
        # print('--------------------', insertIndex, '/', dataInsertListLen, dataInsertList[insertIndex])
        for dataIndex in range(dataLen):
            last = dataIndex != (dataLen - 1) and ', ' or ')'
            if dataIndex == 0:
                dataTitle = dataInsertList[insertIndex][dataIndex]
                insertItem = '"' + dataTitle + '"'
                # print(' date is : {}'.format(dataTitle))
                if insertIndex == 0:
                    stockDateInfo['start_date'] = dataTitle
                    stockDateInfo['end_date'] = dataTitle
                else:
                    if not stockDateInfo['end_date'] or dataTitle > stockDateInfo['end_date']:
                        stockDateInfo['end_date'] = dataTitle
                    if not stockDateInfo['start_date'] or dataTitle < stockDateInfo['start_date']:
                        stockDateInfo['start_date'] = dataTitle
            else:
                insertItem = str(dataInsertList[insertIndex][dataIndex])

            insertSentence += str(insertItem.replace('--', 'null')) + last
            # print('insertSentence = ', insertSentence)
        try:
            cursor.execute(insertSentence)
        except Exception as e:
            print('insert table [{}] data fail: '.format(tableName), e)
    try:
        db.commit()
    except Exception as e:
        print('insert table [{}] data fail when commit: '.format(tableName), e)
    return {'titleDict': titleDict, 'insertTitle': insertTitle, 'stockDateInfo': stockDateInfo}
    # print('===============table [{}] create complete!'.format(tableName))


def createReport(income_filepath, cursor, db, reportStockList, suffixName):
    fileList = []
    if len(reportStockList) == 0:
        fileList = os.listdir(income_filepath)
    else:
        for stockCode in reportStockList:
            fileList.append(suffixName + "_" + stockCode + '.csv')
    # print('create report list is {}'.format(fileList))
    insertTitle = ''
    titleDict = None
    stockDateInfoList = []
    for fileName in fileList:
        info = createTableFunc(income_filepath, fileName, cursor, db, insertTitle)
        stockDateInfoList.append(info['stockDateInfo'])
        if not insertTitle:
            insertTitle = info['insertTitle']
            titleDict = info['titleDict']
            # print('fileName~ insertTitle={}'.format(titleDict))
    return {'titleDict': titleDict, 'stockDateInfoList': stockDateInfoList}


if __name__ == "__main__":
    createTableFunc('./income_statements/', 'income_000001.csv', None, None, '')
