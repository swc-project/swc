console.log('loading d.js');
function foo() {
    console.log('d.js');
}
const foo1 = foo;
const foo2 = foo1;
console.log('loading c.js');
function c() {
    foo2();
}
const c1 = c;
const c2 = c1;
c2();
