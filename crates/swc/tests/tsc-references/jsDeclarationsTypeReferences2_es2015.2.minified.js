export const o = {
    a: 1,
    m: 1
};
let { a , m  } = require("./something").o;
module.exports = {
    thing: a + m
};
