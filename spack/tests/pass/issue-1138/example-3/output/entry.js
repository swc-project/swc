const a = "a";
const a1 = a;
const a2 = a1;
const defaultA = a2;
const o = {
};
const { a: a3 = defaultA  } = o;
console.log(a3);
