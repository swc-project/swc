function nonParameter(input) {
    let [value = undefined] = input;
    return value;
}

console.log(nonParameter([]));
