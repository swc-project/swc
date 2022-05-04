const expect = require("expect");

const foo = async (x, y, ...z) => {
    return this;
};

const _this = (() => this)();

console.log(foo.length);

expect(typeof foo(1, 2, 3)).toEqual("object");
