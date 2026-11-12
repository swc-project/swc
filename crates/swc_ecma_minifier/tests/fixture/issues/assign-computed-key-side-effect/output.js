function key() {
    return console.log("key"), "a";
}
function value() {
    return console.log("value"), 1;
}
key(), value(), key(), value(), value();
