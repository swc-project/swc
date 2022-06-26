// all expected to be errors
class clodule1 {
}
(function(clodule1) {
    function f(x) {}
})(clodule1 || (clodule1 = {}));
class clodule2 {
}
(function(clodule2) {
    var x;
    class D {
    }
})(clodule2 || (clodule2 = {}));
class clodule3 {
}
(function(clodule3) {
    var y = clodule3.y = {
        id: T
    };
})(clodule3 || (clodule3 = {}));
class clodule4 {
}
(function(clodule4) {
    class D {
    }
})(clodule4 || (clodule4 = {}));
