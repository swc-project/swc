const obj = { longprop: 1, other: 2 };
const dynamicKey = "other";

console.log(
    obj.longprop,
    obj["longprop"],
    "longprop" in obj,
    obj[dynamicKey],
    "longprop"
);
