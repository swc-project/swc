var npmlog = module.exports = new class {
    on(s) {
    }
}();
npmlog.on("hi"), module.exports.on("hi"), npmlog.x = 1, module.exports.y = 2, npmlog.y, module.exports.x;
var npmlog = require("./npmlog");
npmlog.x, npmlog.on;
