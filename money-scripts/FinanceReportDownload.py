# -*- coding: utf-8 -*
import time
import urllib.request


def downloadReport(stockList, url, path):
    loadedCount = 0
    failList = []
    for symbol in stockList:
        loadUrl = str(url).replace('%name%', str(symbol))
        fileName = str(symbol)
        while True:
            try:
                savePath = str(path).replace('%name%', fileName)
                urllib.request.urlretrieve(loadUrl, savePath)
                # print('loaded {} by "{}" and saved in "{}"'.format(symbol, url, savePath))
                loadedCount += 1
                time.sleep(0.3)
                break
            except Exception as e:
                failList.append(fileName)
                if str(e) == 'HTTP Error 404: Not Found':
                    break
                else:
                    print('load {} fail ~ {}'.format(str(symbol), e))
                    continue
    # print('loaded {} {} stocks\' report , and {} fail : failList={}'.format(loadedCount, fileName, len(failList), failList))
