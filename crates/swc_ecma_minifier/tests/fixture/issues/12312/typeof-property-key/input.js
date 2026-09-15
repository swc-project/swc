const object = {
    boolean: "PASS",
    longprop: "mangled"
};

console.log(object[typeof true], object[true && typeof true], object.longprop);
