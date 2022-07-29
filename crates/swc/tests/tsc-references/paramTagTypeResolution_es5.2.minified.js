module.exports = function(x, k) {
    return k(x);
};
require("./first")(1, function(n) {});
