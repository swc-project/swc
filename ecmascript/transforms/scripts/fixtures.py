#!/usr/bin/python3


from os import listdir
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

    print()
    print('// {}'.format(name))
    if 'exec.js' in m:
        print('test_exec!(syntax(), |_| tr(Default::default()), {}, r#"\n{}\n"#);'.format(
            name, m['exec.js']
        ))
    elif 'input.js' in m and 'output.js' in m:
        print('test!(syntax(),|_| tr(Default::default()), {}, r#"\n{}\n"#, r#"\n{}\n"#);'.format(
            name, m['input.js'], m['output.js']
        ))
    elif 'stdout.txt' in m:
        pass
    elif len(m.keys()) == 1 and 'options.json' in m:
        pass
    elif len(m.keys()) == 2 and 'input.js' in m and 'options.json' in m:
        pass
    else:
        print(m.keys())
        raise Exception(m)
