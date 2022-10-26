//// [rectangle.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
module.exports = {
    Rectangle: function Rectangle() {
        "use strict";
        _class_call_check(this, Rectangle), console.log("I'm a rectangle!");
    }
};
//// [index.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Rectangle = require("./rectangle").Rectangle, Render = function() {
    "use strict";
    function Render() {
        _class_call_check(this, Render), this.objects = [];
    }
    return Render.prototype.addRectangle = function() {
        var obj = new Rectangle();
        return this.objects.push(obj), obj;
    }, Render;
}();
module.exports = {
    Render: Render
};
//// [test.js]
var render = new (require("./index")).Render();
render.addRectangle(), console.log("Objects", render.objects);
