import * as path from 'path'
import { parseModule } from 'esprima'
import { readFileSync, writeFileSync } from 'fs';


const indexPath = path.resolve('..', '..', 'packages', 'swc-helpers', 'src', 'index.js');
console.log(indexPath);

const src = readFileSync(indexPath, 'utf8');

const module = parseModule(src)

const items = module.body
    .filter(item => item.type === 'ExportNamedDeclaration')
    .map(item => ({
        src: item.source.value.replace('./_', ''),
        export: item.specifiers[0].exported.name,
    }))

console.log(items);

const helperMacroCode = `
    #[macro_export]
    macro_rules! gen_ext_helper_name {
        ${items.map((item => `(${item.src}) => { Some("${item.export}") }`)).join('\n\n')}

        ($name:ident) => { None }
    }
`

writeFileSync(path.resolve('src', 'helpers_gen.rs'), helperMacroCode, 'utf8');