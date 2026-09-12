const object = {
    b: "long"
};
globalThis.external = {}, globalThis.external["a"] = "strict", console.log(globalThis.external.a, object.b);
