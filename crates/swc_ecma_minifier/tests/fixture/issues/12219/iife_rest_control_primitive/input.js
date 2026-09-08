var f = ((...r) => () => r[0])(1);
console.log(f() === f());
