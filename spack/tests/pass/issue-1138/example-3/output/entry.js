const a = "a";
const defaultA = a;
const o = {
};
const { a: a1 = defaultA  } = o;
console.log(a1);
