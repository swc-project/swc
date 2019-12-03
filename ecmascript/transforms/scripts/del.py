#!/usr/bin/python3


from os import listdir, remove
from os.path import isfile, join

files = [f for f in listdir('./fixtures') if isfile(join('./fixtures', f))]

fm = {}

for f in files:
    name = join('./fixtures', f)
    test_name, file_type = f.rsplit('-', 1)
    if file_type == 'input.mjs':
        file_type = 'input.js'
    if file_type == 'input.mjsz':
        file_type = 'input.js'
    if file_type == 'output.mjs':
        file_type = 'output.js'
    if file_type == 'output.mjsz':
        file_type = 'output.js'

    if file_type == 'exec.js':
        test_name = '{}_exec'.format(test_name)

    if not test_name in fm:
        fm[test_name] = {}
    with open(name, "r") as f:
        fm[test_name][file_type] = f.read()

for name in fm:
    m = fm[name]
    name = name.replace('-', '_')

    if not 'options.json' in m:
        for k in m.keys():
            remove(m[k])
        continue