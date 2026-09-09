const object = { longproperty: "long" };

globalThis.external = {};
globalThis.external["a" + ""] = "strict";

console.log(globalThis.external.a, object.longproperty);
