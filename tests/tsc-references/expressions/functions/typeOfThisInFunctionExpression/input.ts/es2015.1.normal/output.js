// type of 'this' in FunctionExpression is Any
function fn() {
    var p = this;
    var p;
}
var t = function() {
    var p = this;
    var p;
};
var t2 = function f() {
    var x = this;
    var x;
};
class C {
    constructor(){
        this.x = function() {
            var q;
            var q = this;
        };
        this.y = function ff() {
            var q;
            var q = this;
        };
    }
}
var M;
(function(M) {
    function fn() {
        var p = this;
        var p;
    }
    var t = function() {
        var p = this;
        var p;
    };
    var t2 = function f() {
        var x = this;
        var x;
    };
})(M || (M = {
}));
