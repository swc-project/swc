import * as swcHelpers from "@swc/helpers";
var Rectangle = function Rectangle() {
    "use strict";
    swcHelpers.classCallCheck(this, Rectangle);
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
        swcHelpers.classCallCheck(this, Render);
        /**
         * Object list
         * @type {Rectangle[]}
         */ this.objects = [];
    }
    swcHelpers.createClass(Render, [
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
