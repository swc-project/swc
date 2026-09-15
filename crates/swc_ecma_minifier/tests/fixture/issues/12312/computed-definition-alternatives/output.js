const flag = true;
const object = {
    [flag ? "o" : "e"]: "PASS",
    ["p"]: "SEQUENCE"
};
console.log(object.o, object.p);
