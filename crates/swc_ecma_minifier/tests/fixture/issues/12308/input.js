Promise.resolve("resolve-1").then(console.log);
Promise.resolve("resolve-2").then(console.log);
Promise.reject("reject-1").catch(console.log);
Promise.reject("reject-2").catch(console.log);
Promise.all([Promise.resolve("all-1")]).then(([value]) => console.log(value));
Promise.all([Promise.resolve("all-2")]).then(([value]) => console.log(value));

console.log(Object.keys({ eligible: true })[0]);
console.log(Object.keys({ retained: true })[0]);
