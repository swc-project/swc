var f = ((...r) => () => r[0])(/x/);
console.log(f() === f());
