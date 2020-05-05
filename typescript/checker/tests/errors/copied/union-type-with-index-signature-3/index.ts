type Missing = { foo: number, bar: true } | { [s: string]: string } | { foo: boolean }
declare var m: Missing
m.foo = 'hi'
m.bar