#!/usr/bin/python3


import shutil
from os import listdir
from os.path import isfile, join


def search(dir):
    print('Searching ', dir)
    entries = listdir(dir)
    if len(entries) == 1 and 'fixtures' in dir:
        shutil.rmtree(dir, ignore_errors=True)
        return True

    if len(entries) == 2 and 'fixtures' in dir and 'options.json' in entries and 'input.js' in entries:
        shutil.rmtree(dir, ignore_errors=True)
        return True


    shouldDelete = True;
    for f in listdir(dir):
        p = join(dir, f);
        if isfile(p):
            if f == 'options.json':
                return False
        else:
            if not search(p):
                shouldDelete = False
            if isfile(join(dir, 'options.json')) and not isfile(join(p, 'options.json')):
                shutil.copyfile(join(dir, 'options.json'), join(p, 'options.json'))
    if shouldDelete and 'fixtures' in dir:
        shutil.rmtree(dir, ignore_errors=True)
    return True


search('./')
