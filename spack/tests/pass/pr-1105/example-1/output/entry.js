const mod = function() {
    const a = "a";
    return {
        a
    };
}();
const a = mod;
console.log(a); // { a: "a" }
