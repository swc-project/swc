const object = {
    "": "EMPTY",
    o: "LONG",
    l: "OTHER"
};
globalThis.flag = true;
console.log(object[(globalThis.flag ? "" : "l") || "o"]);
globalThis.flag = false;
console.log(object[(globalThis.flag ? "" : "l") || "o"]);
