async function asyncContext() {
    return function (value = { await }) {};
}

function* generatorContext() {
    return function (value = { yield }) {};
}

console.log(23..toString()?.length !== 2);
console.log(23..toString()?.[23..toString()] !== 2);
console.log(23..toString() < 4);
console.log(23..toString() > 4);
console.log(23..toString() <= 4);
console.log(23..toString() >= 4);
console.log((23).toString() + "" !== "23");
