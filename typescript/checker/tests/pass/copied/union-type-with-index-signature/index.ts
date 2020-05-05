type Two = { foo: { bar: true }, baz: true } | { [s: string]: string };
declare var u: Two
u.foo = 'bye'
u.baz = 'hi'