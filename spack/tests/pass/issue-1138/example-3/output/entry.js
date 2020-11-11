const a = "a";
const a1 = a;
const defaultA = a1;
const o = {
};
const { a: a2 = defaultA  } = o;
console.log(a2);
