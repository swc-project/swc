const obj = { known: "known", dynamic: "dynamic" };

globalThis.key = "dynamic";
globalThis.condition = false;

console.log(obj[globalThis.condition ? "known" : globalThis.key]);
