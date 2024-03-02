let a;
const myArr = [];
Math.random() > 0.5 && (a = !0);
let b = (myArr.push('foo'), 'foo');
console.log(a ??= b), console.log(myArr);
