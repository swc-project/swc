const object = {
    "": "EMPTY",
    longprop: "LONG",
    otherprop: "OTHER",
};

globalThis.flag = true;
console.log(object[(globalThis.flag ? "" : "otherprop") || "longprop"]);

globalThis.flag = false;
console.log(object[(globalThis.flag ? "" : "otherprop") || "longprop"]);
