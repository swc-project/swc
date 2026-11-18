const o = id("one");
const l = null;
const s = "two";
const n = false ? 0 : true;
const c = false ? 1 : false;
console.log(l ?? o);
console.log(s ?? o);
console.log(n ?? o);
console.log(c ?? o);
