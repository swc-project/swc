import "module";
let foobar = "foo";
export const foo = foobar;
let foobarCopy = foobar += "bar";
foobar += "foo", console.log(foobarCopy);
