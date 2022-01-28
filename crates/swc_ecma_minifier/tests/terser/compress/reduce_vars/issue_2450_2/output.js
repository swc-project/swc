function g() {
    return function () {};
}
console.log(g() === g());
