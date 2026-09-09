const object = {
    NaN: "PASS",
    a: "mangled"
};
console.log(object[0 / 0], object.a);
