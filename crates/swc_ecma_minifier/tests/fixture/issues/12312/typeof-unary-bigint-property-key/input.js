const object = {
    bigint: "PASS",
    longproperty: "mangled"
};

console.log(object[typeof -1n], object[typeof ~1n], object.longproperty);
