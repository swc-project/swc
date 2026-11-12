function key() {
    console.log("key");
    return "a";
}
function value() {
    console.log("value");
    return 1;
}
function assign() {
    ({})[key()] = value();
}
function compound() {
    ({})[key()] += value();
}
function pure(k) {
    ({})[k] = value();
}
assign();
compound();
pure("a");
