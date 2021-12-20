class Bar {
}
module.exports = Bar;
const Bar = require("./bar");
module.exports = class extends Bar {
}, module.exports.Strings = {
    a: "A",
    b: "B"
};
