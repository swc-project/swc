var hardline = {
    type: "hard"
};
module.exports = {
    hardline: hardline
}, module.exports = {
    nested: require("./first")
};
var hardline = require("./second").nested.hardline;
