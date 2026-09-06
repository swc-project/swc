function effect(name) {
    console.log(name);
    return name;
}

console.log(
    "A".toLowerCase(effect("lower")),
    "b".toUpperCase(effect("upper")),
);
