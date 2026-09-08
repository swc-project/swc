function call(Symbol1) {
    return Symbol1("shadowed");
}
console.log(call((value)=>value));
console.log(typeof Symbol());
