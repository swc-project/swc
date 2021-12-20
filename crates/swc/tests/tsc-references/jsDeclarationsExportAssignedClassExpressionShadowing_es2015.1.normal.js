// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
class A {
    constructor(){
        this.member = new Q();
    }
}
class Q {
    constructor(){
        this.x = 42;
    }
}
module.exports = class Q {
    constructor(){
        this.x = new A();
    }
};
module.exports.Another = Q;
