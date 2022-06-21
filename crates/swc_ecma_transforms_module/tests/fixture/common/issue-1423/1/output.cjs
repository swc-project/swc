var _necessary = require("necessary");
"use strict";
const { second  } = _necessary.arrayUtilities;
const elements = [
    1,
    2,
    3
], secondElement = second(elements);
console.log(secondElement);
