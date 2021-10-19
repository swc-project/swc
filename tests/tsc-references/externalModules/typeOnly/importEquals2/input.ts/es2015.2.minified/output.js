import * as a from "./a";
module.exports = a;
const a = require("./b");
new a.A(); // Error
