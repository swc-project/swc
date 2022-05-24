import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Rectangle = function() {
    "use strict";
    _class_call_check(this, Rectangle), console.log("I'm a rectangle!");
};
module.exports = {
    Rectangle: Rectangle
};
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
var Render = require("./index").Render, render = new Render();
render.addRectangle(), console.log("Objects", render.objects);
