var Parser = function Parser() {};
var p = Parser.prototype;
var unused = p.x;
p.initialContext = function initialContext() {
    p.y;
    console.log("PASS");
};
p.braceIsBlock = function () {};
new Parser().initialContext();
