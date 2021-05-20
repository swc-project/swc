var Parser = function Parser() {};
var p = Parser.prototype;
p.initialContext = function initialContext() {
    console.log("PASS");
};
p.braceIsBlock = function () {};
new Parser().initialContext();
