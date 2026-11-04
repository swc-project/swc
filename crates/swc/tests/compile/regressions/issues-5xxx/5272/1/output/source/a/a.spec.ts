Object.defineProperty(exports, "__esModule", {
    value: true
});
var _a = require("./a");
describe("a", function() {
    it("does its thing", function() {
        var a = new _a.Foo();
        expect(a.bar()).toBe(3);
        expect(a.foo()).toBe(2);
    });
});
