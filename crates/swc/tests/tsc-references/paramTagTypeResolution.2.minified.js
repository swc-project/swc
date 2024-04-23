//// [first.js]
module.exports = function(x, k) {
    return k(x);
};
//// [main.js]
require('./first')(1, function(n) {});
