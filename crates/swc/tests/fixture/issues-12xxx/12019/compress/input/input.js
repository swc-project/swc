let count = 0;
(/* #__PURE__ */ new Set([1])).forEach(() => count++);
(0, /* #__PURE__ */ new Set([2])).forEach(() => count++);
(true && /* #__PURE__ */ new Set([3])).forEach(() => count++);
const value = /* #__PURE__ */ new Set([4]);
value.forEach(() => count++);
console.log((/* #__PURE__ */ [1, 2]).length);
console.log(count);
