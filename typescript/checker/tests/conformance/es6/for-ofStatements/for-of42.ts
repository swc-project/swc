﻿//@target: ES6
var array = [{ x: "", y: 0 }]
for (var {x: a, y: b} of array) {
    a;
    b;
}