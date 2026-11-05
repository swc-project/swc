var _wrap_reg_exp = require("@swc/helpers/_/_wrap_reg_exp");
var SIMPLE_REGEX = _wrap_reg_exp._(/^(hello)\s+(\w+)$/, {
    greeting: 1,
    name: 2
}, "^(?<greeting>hello)\\s+(?<name>\\w+)$");
var COMPOSED_REGEX = [
    /^/,
    _wrap_reg_exp._(/([^[]+)/, {
        tagName: 1
    }, "(?<tagName>[^[]+)"),
    _wrap_reg_exp._(/(?:\[([^\]=]+)=\"([^\"]+)\"\])?/, {
        attrName: 1,
        attrValue: 2
    }, '(?:\\[(?<attrName>[^\\]=]+)=\\"(?<attrValue>[^\\"]+)\\"\\])?'),
    /$/
].map(function(r) {
    return r.source;
}).join("");
var match1 = "hello world".match(SIMPLE_REGEX);
var match2 = 'w:tag[w:val="test"]'.match(COMPOSED_REGEX);
console.log(match1 === null || match1 === void 0 ? void 0 : match1.groups, match2 === null || match2 === void 0 ? void 0 : match2.groups);
