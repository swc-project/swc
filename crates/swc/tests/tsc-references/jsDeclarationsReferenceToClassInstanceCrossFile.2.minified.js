//// [rectangle.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
module.exports = {
    Rectangle: function Rectangle() {
        _class_call_check(this, Rectangle), console.log("I'm a rectangle!");
    }
};
//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Rectangle = require('./rectangle').Rectangle, Render = /*#__PURE__*/ function() {
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
