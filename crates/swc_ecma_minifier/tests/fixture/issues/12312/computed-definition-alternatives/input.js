const flag = true;
const object = {
    [flag ? "longprop" : "otherprop"]: "PASS",
    [(0, "sequenceprop")]: "SEQUENCE",
};

console.log(object.longprop, object.sequenceprop);
