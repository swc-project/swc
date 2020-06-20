function foo() {
    console.log('a()');
}
function bar() {
    console.log('a()');
}
function a() {
}
function b() {
}
console.log(a(), foo(), b(), bar());
