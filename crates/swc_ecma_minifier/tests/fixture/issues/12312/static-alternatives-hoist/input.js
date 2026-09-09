const obj = { foo: "foo", bar: "bar" };

globalThis.condition = true;

console.log(obj[globalThis.condition ? "foo" : "bar"]);
