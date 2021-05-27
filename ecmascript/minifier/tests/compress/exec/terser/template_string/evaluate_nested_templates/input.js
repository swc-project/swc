/*#__NOINLINE__*/ const any = 'any string, but should not be inlined';

var foo = `${`${`${`foo`}`}`}`;
var bar = `before ${`innerBefore ${any} innerAfter`} after`;
var baz = `1 ${2 + `3 ${any} 4` + 5} 6`;
