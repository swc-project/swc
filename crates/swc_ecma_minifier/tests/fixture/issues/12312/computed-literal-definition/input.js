const selected = { longprop: 0 };
const obj = { ["longprop"]: 1 };

console.log(obj.longprop, obj["longprop"], "longprop" in obj, selected.longprop);
