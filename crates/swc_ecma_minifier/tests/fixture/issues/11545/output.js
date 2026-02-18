function joinArrayWithUndefined(bool) {
    return [
        "abc",
        bool ? void 0 : "def"
    ].join("");
}
console.log(joinArrayWithUndefined(true));
console.log(joinArrayWithUndefined(false));
const x = "abc";
console.log(x);
