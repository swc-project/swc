module.exports = {
    hardline: {
        type: "hard"
    }
};
module.exports = {
    nested: require("./first")
};
require("./second").nested.hardline;
