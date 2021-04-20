import json


def createJson(dic, path):
    try:
        jsonStr = json.dumps(dic)
        createFile(jsonStr, path)
    except Exception as e:
        print('create json file[{}] fail : '.format(path), e)


def createFile(value, path):
    try:
        f2 = open(path, 'w', encoding='utf-8')
        f2.write(value)
        print('create file[{}] successful! : '.format(path))
    except Exception as e:
        print('create file[{}] fail : '.format(path), e)


createJson({"name": "Tim", "age": 35}, "./jsons/income/test.json")
