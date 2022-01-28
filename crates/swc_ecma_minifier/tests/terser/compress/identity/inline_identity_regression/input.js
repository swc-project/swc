global.id = (x) => x;
const foo = ({ bar: bar }) => id(bar);
console.log(foo({ bar: "PASS" }));
