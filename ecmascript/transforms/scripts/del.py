#!/usr/bin/python3


from os import listdir, remove
from os.path import isfile, join
import shutil

def search(dir):
    print('Searching ', dir)
    if len(listdir(dir)) == 1:
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
    if shouldDelete:
        shutil.rmtree(dir, ignore_errors=True)
    return True


search('./fixtures')
