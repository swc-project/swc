global.id = (o) => o;
const o = ({ bar: o }) => id(o);
console.log(o({ bar: "PASS" }));
