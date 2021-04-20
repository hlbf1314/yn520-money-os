def takesTime(sec):
    hour = round(sec / 3600)
    sec = sec % 3600
    minute = round(sec / 60)
    second = sec % 60
    return hour, minute, second


def takesTimeLog(sec, log):
    timeTuple = takesTime(sec)
    return str(log).format(timeTuple[0], timeTuple[1], timeTuple[2])
