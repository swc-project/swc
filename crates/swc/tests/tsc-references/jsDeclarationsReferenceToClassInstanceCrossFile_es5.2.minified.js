function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
var Rectangle = function() {
    "use strict";
    _classCallCheck(this, Rectangle), console.log("I'm a rectangle!");
};
module.exports = {
    Rectangle: Rectangle
};
var Rectangle = require("./rectangle").Rectangle, Render = function() {
    "use strict";
    var Constructor, protoProps, staticProps;
    function Render() {
        _classCallCheck(this, Render), this.objects = [];
    }
    return Constructor = Render, protoProps = [
        {
            key: "addRectangle",
            value: function() {
                var obj = new Rectangle();
                return this.objects.push(obj), obj;
            }
        }
    ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Render;
}();
module.exports = {
    Render: Render
};
var Render = require("./index").Render, render = new Render();
render.addRectangle(), console.log("Objects", render.objects);
