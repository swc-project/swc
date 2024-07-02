import typescript from 'typescript'
import fs from 'fs'
import module from 'module'

const require = module.createRequire(import.meta.url)
const ts = fs.readFileSync('./tests/decorator-tests/decorator-tests.ts', 'utf8')

// Convert TypeScript to JavaScript for testing JavaScript VMs
console.log('Converting TypeScript to JavaScript...')

const program = typescript.createProgram({
    rootNames: ['./tests/decorator-tests/decorator-tests.ts'],
    options: { target: typescript.ScriptTarget.ESNext }
});
// console.log('program', program)
const mainFile = program.getSourceFile('./tests/decorator-tests/decorator-tests.ts')
// console.log('mainFile', mainFile)

const testVarStmt = mainFile.statements.find((s) => s.kind === typescript.SyntaxKind.VariableStatement)
// console.log('testVarStmt', testVarStmt)

const testVarDecl = testVarStmt.declarationList.declarations[0]
// console.log('testVarDecl', testVarDecl)

const properties = testVarDecl.initializer.properties
// console.log('properties', properties)

fs.rmdirSync(`tests/decorator-evanw-split`, { recursive: true });
fs.mkdirSync(`tests/decorator-evanw-split`, { recursive: true });

for (const property of properties) {
    let name = property.name.getText(mainFile)
    const value = property.initializer.getText(mainFile)

    name = name.replace(/['\(\)"']+/g, '').replace(/[\:; ]+/g, '-')

    // console.log('name', name)
    // console.log('value', value)

    const code = `(${value})()`;
    const transpiiled = typescript.transpile(code, { target: typescript.ScriptTarget.ESNext })

    fs.writeFileSync(`tests/decorator-evanw-split/${name}.js`, transpiiled)
}

