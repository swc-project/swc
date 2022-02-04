module.exports = {
    x: {
        y: "value"
    }
};
const value = require("./mod").x.y;
console.log(value);
