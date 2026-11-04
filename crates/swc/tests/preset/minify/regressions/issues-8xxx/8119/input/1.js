const myArr = [];
// function with side effect
function foo(arr) {
    arr.push('foo');
    return 'foo';
}
let a;

if (Math.random() > 0.5) {
    a = true;
}

// the function call below should always run
// regardless of whether `a` is `undefined`
let b = foo(myArr);

// const seems to keep this line here instead of
// moving it behind the logitcal nullish assignment
// const b = foo(myArr);

a ??= b;

console.log(a);
console.log(myArr);