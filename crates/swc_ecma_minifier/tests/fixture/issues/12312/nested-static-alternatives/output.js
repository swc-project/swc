const obj = {};
obj["o"] = 1;
obj["p"] = 2;
console.log(obj[globalThis.condition ? "o" : "p"], obj["o"]);
