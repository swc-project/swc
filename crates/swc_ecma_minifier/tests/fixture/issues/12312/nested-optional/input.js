const obj = { longprop: { longprop: 1 } };
console.log(obj["longprop"]["longprop"], obj?.["longprop"]?.["longprop"], "longprop" in obj["longprop"]);
