import "module";
let foobar = "foo";
export const foo = foobar;
let foobarCopy = foobar += "bar";
foobar += "foo", console.log(foobarCopy);
 // export function external1() {
 //     return internal() + foobar;
 // }
 // export function external2() {
 //     foobar += ".";
 // }
