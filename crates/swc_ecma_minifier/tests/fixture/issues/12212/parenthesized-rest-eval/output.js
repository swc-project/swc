function parenthesized(...rest) {
    return eval("rest.length");
}
console.log(parenthesized(1));
