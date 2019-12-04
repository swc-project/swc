#!/usr/bin/env python3


from os import listdir
from os.path import isfile, join

files = [f for f in listdir('./fixtures') if isfile(join('./fixtures', f))]

fm = {}

for f in files:
    name = join('./fixtures', f)
    if '.DS_Store' in f:
        continue
    test_name, file_type = f.rsplit('_', 1)
    if file_type == 'input.mjs':
        file_type = 'input.js'
    if file_type == 'input.mjsz':
        file_type = 'input.js'
    if file_type == 'output.mjs':
        file_type = 'output.js'
    if file_type == 'output.mjsz':
        file_type = 'output.js'


    if file_type == 'exec.mjs':
        file_type = 'exec.js'
    if file_type == 'exec.mjsz':
        file_type = 'exec.js'

    if not test_name in fm:
        fm[test_name] = {}
    with open(name, "r") as f:
        fm[test_name][file_type] = f.read()


for name in fm:
    m = fm[name]
    name = name.replace('-', '_')

    print()
    print('// {}'.format(name))
    if 'exec.js' in m:
        if 'options.json' in m:
            print('test_exec!(syntax(), |_| tr(r#"{}"#), {}_exec, r#"\n{}\n"#);'.format(
                m['options.json'],name, m['exec.js']
            ))
        else:
            print('test_exec!(syntax(), |_| tr(Default::default()), {}_exec, r#"\n{}\n"#);'.format(
                name, m['exec.js']
            ))
    elif 'input.js' in m and 'output.js' in m:
        if 'options.json' in m:
            print('test!(syntax(),|_| tr(r#"{}"#), {}, r#"\n{}\n"#, r#"\n{}\n"#);'.format(
                m['options.json'], name, m['input.js'], m['output.js']
            ))
        else:
            print('test!(syntax(),|_| tr(Default::default()), {}, r#"\n{}\n"#, r#"\n{}\n"#);'.format(
                name, m['input.js'], m['output.js']
            ))
    elif 'stdout.txt' in m:
        pass
    else:
        print(m.keys())
        raise Exception(name, m)
