//// [index.js]
function foo() {
    module.exports = exports = function exports(o) {
        return null == o ? create(base) : defineProperties(Object(o), descriptors);
    };
    var m = function() {};
    exports.methods = m;
}
