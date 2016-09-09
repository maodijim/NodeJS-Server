def getId():
    f = open('/proc/cpuinfo','r')
    for line in f:
        if line[0:6] == 'Serial':
            cpuSerial = line[10:26]
            return cpuSerial
