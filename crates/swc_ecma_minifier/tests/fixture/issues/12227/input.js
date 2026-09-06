function call(Symbol) {
    return Symbol("shadowed");
}

console.log(call((value) => value));
console.log(typeof Symbol("unshadowed"));
