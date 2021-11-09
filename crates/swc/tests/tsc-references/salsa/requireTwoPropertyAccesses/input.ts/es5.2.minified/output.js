module.exports = {
    x: {
        y: "value"
    }
};
var value = require("./mod").x.y;
console.log(value);
