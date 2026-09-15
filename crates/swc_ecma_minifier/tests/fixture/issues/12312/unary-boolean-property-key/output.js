const object = {
    true: "TRUE",
    false: "FALSE",
    a: "MANGLED"
};
console.log(object[!0], object[!globalThis.value], object.a);
