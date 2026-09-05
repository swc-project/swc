var f = ((r) => () => r)(/x/);
console.log(f() === f());
