console.log('loading d.js');
function foo() {
    console.log('d.js');
}
console.log('loading c.js');
function c() {
    foo();
}
c();
