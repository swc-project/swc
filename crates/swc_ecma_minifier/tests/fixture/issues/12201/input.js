function printArray(array) {
    console.log(array.length, 0 in array, array.join(","));
}

function fromSpreads(first, second) {
    return Array(...first, ...second);
}

// Unknown spreads may produce exactly one numeric argument.
printArray(fromSpreads([3], []));

// Unknown spreads producing multiple elements must keep their element-list semantics.
printArray(fromSpreads([3], [4]));

// Literal spreads have known arity and may still use the existing folds.
printArray(Array(...[3], ...[]));
printArray(Array(...[3], ...[4]));
