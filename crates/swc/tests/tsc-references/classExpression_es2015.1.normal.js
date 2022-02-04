var x = class C {
};
var y = {
    foo: class C2 {
    }
};
var M;
(function(M) {
    var z = class C4 {
    };
})(M || (M = {}));
