let a;
const myArr = [];
// function with side effect
function foo(arr) {
    return arr.push('foo'), 'foo';
}
Math.random() > 0.5 && (a = !0);
// the function call below should always run
// regardless of whether `a` is `undefined`
let b = foo(myArr);
// const seems to keep this line here instead of
// moving it behind the logitcal nullish assignment
// const b = foo(myArr);
a ??= b;
console.log(a);
console.log(myArr);
