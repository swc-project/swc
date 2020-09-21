declare function foo(): Pick<any, 'foo' | 'bar'>;

let a = foo();