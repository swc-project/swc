import * as swcHelpers from "@swc/helpers";
var Rectangle = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Rectangle), console.log("I'm a rectangle!");
};
module.exports = {
    Rectangle: Rectangle
};
var Rectangle = require("./rectangle").Rectangle, Render = function() {
    "use strict";
    function Render() {
        swcHelpers.classCallCheck(this, Render), this.objects = [];
    }
    return swcHelpers.createClass(Render, [
        {
            key: "addRectangle",
            value: function() {
                var obj = new Rectangle();
                return this.objects.push(obj), obj;
            }
        }
    ]), Render;
}();
module.exports = {
    Render: Render
};
var Render = require("./index").Render, render = new Render();
render.addRectangle(), console.log("Objects", render.objects);
