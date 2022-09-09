const o = (o) => o;
console.log(o((o) => o + 1)(1), o(((o) => o + 1)(2)));
