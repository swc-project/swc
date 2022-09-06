(o) => 1;
var o = (o) => o;
console.log(o(1));
o = (o) => o;
console.log(o(2));
console.log({ m: (o) => (o ? "3" : "4") }.m(true));
