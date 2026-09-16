const object = {
    "9007199254740993": "PASS",
    longprop: "mangled"
};

console.log(object[9007199254740993n], object.longprop);
