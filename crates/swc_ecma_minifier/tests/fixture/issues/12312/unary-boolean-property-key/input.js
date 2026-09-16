const object = {
    true: "TRUE",
    false: "FALSE",
    longproperty: "MANGLED"
};

console.log(object[!0], object[!globalThis.value], object.longproperty);
