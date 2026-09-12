const obj = {};

obj["longprop"] = 1;
obj["otherprop"] = 2;

console.log(
    obj[globalThis.condition ? "longprop" : "otherprop"],
    obj[(0, "longprop")],
);
