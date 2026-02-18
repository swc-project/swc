function joinArrayWithUndefined(bool) {
    return ["abc", bool ? undefined : "def"].join("");
}
console.log(joinArrayWithUndefined(true));
console.log(joinArrayWithUndefined(false));
const x = ["abc", undefined].join("");
console.log(x);
