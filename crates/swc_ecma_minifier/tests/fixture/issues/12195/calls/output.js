function effect(name) {
    return console.log(name), name;
}
console.log("A".toLowerCase(effect("lower")), "b".toUpperCase(effect("upper")));
