"use strict";
var _moduleA = require("./moduleA.js");
let Demo = _decorate([
    (0, _moduleA.default)('0.0.1')
], function(_initialize) {
    class Demo {
        constructor(){
            _initialize(this);
            this.author = 'alan';
        }
    }
    return {
        F: Demo,
        d: []
    };
});
