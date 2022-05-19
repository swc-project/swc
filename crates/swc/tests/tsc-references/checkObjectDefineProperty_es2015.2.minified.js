let x = {};
Object.defineProperty(x, "name", {
    value: "Charles",
    writable: !0
}), Object.defineProperty(x, "middleInit", {
    value: "H"
}), Object.defineProperty(x, "lastName", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(x, "zip", {
    get: ()=>98122,
    set (_) {}
}), Object.defineProperty(x, "houseNumber", {
    get: ()=>21.75
}), Object.defineProperty(x, "zipStr", {
    set (str) {
        this.zip = Number(str);
    }
}), x.name, x.zip, x.houseNumber, module.exports = x;
let x = require("./");
x.name, x.middleInit, x.lastName, x.zip, x.houseNumber, x.zipStr, x.name = "Another", x.zip = 98123, x.zipStr = "OK", x.lastName = "should fail", x.houseNumber = 12, x.zipStr = 12, x.middleInit = "R";
export { };
