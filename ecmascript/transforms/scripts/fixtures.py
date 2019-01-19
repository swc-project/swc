#!/usr/bin/python3


from os import listdir
from os.path import isfile, join

files = [f for f in listdir('./fixtures') if isfile(join('./fixtures', f))]

fm = {}

for f in files:
    name = join('./fixtures', f)
    test_name, file_type = f.rsplit('_', 1)
    if file_type == 'input.mjs':
        file_type = 'input.js'
    if file_type == 'output.mjs':
        file_type = 'output.js'

    if file_type == 'exec.js':
        test_name = '{}_exec'.format(test_name)
    if not test_name in fm:
        fm[test_name] = {}
    with open(name, "r") as f:
        fm[test_name][file_type] = f.read()


for name in fm:
    m = fm[name]
    print()
    # print('// {}'.format(name))
    if 'exec.js' in m:
        print('test_exec!(syntax(), tr, {}, r#"\n{}\n"#);'.format(
            name, m['exec.js']
        ))
        pass
    elif 'options.json' in m:
        pass
    else:
        print('test!(syntax(),tr( Default::default()), {}, r#"\n{}\n"#, r#"\n{}\n"#);'.format(
            name, m['input.js'], m['output.js']
        ))
