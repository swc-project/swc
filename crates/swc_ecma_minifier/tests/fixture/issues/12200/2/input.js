function f(x, y) {
    return [(+x + 1), "", (+y + 2), "z"].join("");
}

function stringControl(x, y) {
    return [x + "a", (+y + 2), "z"].join("");
}

console.log(f(1, 2));
console.log(stringControl(1, 2));
