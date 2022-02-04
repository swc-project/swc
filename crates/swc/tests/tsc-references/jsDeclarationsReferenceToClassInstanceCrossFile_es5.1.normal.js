function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Rectangle = function Rectangle() {
    "use strict";
    _classCallCheck(this, Rectangle);
    console.log("I'm a rectangle!");
};
module.exports = {
    Rectangle: Rectangle
};
// @filename: index.js
var Rectangle = require('./rectangle').Rectangle;
var Render = /*#__PURE__*/ function() {
    "use strict";
    function Render() {
        _classCallCheck(this, Render);
        /**
         * Object list
         * @type {Rectangle[]}
         */ this.objects = [];
    }
    _createClass(Render, [
        {
            /**
     * Adds a rectangle
     * 
     * @returns {Rectangle} the rect
     */ key: "addRectangle",
            value: function addRectangle() {
                var obj = new Rectangle();
                this.objects.push(obj);
                return obj;
            }
        }
    ]);
    return Render;
}();
module.exports = {
    Render: Render
};
// @filename: test.js
var Render = require("./index").Render;
var render = new Render();
render.addRectangle();
console.log("Objects", render.objects);
