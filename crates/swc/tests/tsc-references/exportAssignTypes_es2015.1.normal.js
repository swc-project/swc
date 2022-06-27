// @Filename: expString.ts
var x = "test";
// @Filename: expNumber.ts
var x = 42;
// @Filename: expBoolean.ts
var x = true;
// @Filename: expArray.ts
var x = [
    1,
    2
];
// @Filename: expObject.ts
var x = {
    answer: 42,
    when: 1776
};
// @Filename: expAny.ts
var x;
// @Filename: expGeneric.ts
function x(a) {
    return a;
}
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
module.exports = x;
export { };
