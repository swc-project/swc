const __proto__ = 0;

console.log(Object.keys({ __proto__: null, a: 1 }));
console.log(Object.keys({ "__proto__": null, b: 2 }));

console.log(Object.keys({ __proto__ }));
console.log(Object.keys({ ["__proto__"]: 1 }));
console.log(Object.keys({ __proto__() {} }));

console.log(Object.keys({ a: 1, b: 2 }));
