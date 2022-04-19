var a;
module.exports = ((a = function() {
    "use strict";
    var b;
    function a() {}
    return a.prototype.it = function() {
        this.bb = new a.MyA();
    }, a;
}()).MyA = function() {}, a);
