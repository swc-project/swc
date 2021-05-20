var Parser = function () {};
var p = Parser.prototype;
p.initialContext = function () {
    console.log("PASS");
};
p.braceIsBlock = function () {};
new Parser().initialContext();
