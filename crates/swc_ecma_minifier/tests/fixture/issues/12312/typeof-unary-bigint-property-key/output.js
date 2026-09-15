const object = {
    bigint: "PASS",
    a: "mangled"
};
console.log(object[typeof -1n], object[typeof ~1n], object.a);
