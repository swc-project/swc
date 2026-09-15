function arity(value = undefined) {
    return value;
}

console.log(arity.length);

const arrowArity = (value = undefined) => value;

console.log(arrowArity.length);
