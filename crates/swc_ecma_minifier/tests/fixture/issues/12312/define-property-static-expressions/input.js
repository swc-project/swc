const obj = {};

Object.defineProperty(obj, `longprop`, { value: "T" });
Object.defineProperty(obj, ("otherprop"), { value: "P" });

console.log(obj["longprop"], obj["otherprop"]);
