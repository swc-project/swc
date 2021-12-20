// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: index.js
class Foo {
    constructor(){
        this.member = 10;
    }
}
Foo.stat = 10;
module.exports = new Foo();
module.exports.additional = 20;
