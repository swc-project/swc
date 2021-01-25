const foo = {
};
const foo1 = foo;
const foo2 = foo1;
bar();
function bar() {
    console.log(foo2);
}
