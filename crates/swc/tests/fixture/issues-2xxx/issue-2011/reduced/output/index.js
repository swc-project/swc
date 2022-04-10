var a;
module.exports = ((a = function() {
    function a() {}
    return a.prototype.it = function() {
        this.bb = new a.MyA();
    }, a;
}()).MyA = function() {}, a);
