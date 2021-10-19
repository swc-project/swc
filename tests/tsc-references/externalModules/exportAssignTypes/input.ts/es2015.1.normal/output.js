// @Filename: expString.ts
var x = "test";
module.exports = x;
// @Filename: expNumber.ts
var x = 42;
module.exports = x;
// @Filename: expBoolean.ts
var x = true;
module.exports = x;
// @Filename: expArray.ts
var x = [
    1,
    2
];
module.exports = x;
// @Filename: expObject.ts
var x = {
    answer: 42,
    when: 1776
};
module.exports = x;
// @Filename: expAny.ts
var x;
module.exports = x;
// @Filename: expGeneric.ts
function x(a) {
    return a;
}
module.exports = x;
// @Filename: consumer.ts
const iString = require('./expString');
var v1 = iString;
const iNumber = require('./expNumber');
var v2 = iNumber;
const iBoolean = require('./expBoolean');
var v3 = iBoolean;
const iArray = require('./expArray');
var v4 = iArray;
const iObject = require('./expObject');
var v5 = iObject;
const iAny = require('./expAny');
var v6 = iAny;
const iGeneric = require('./expGeneric');
var v7 = iGeneric;
export { };
