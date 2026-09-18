(function(U) {
    class C {
        constructor(){
            this.w = 3;
        }
    }
    U.C = C;
})(U || (U = {}));
(function(U) {
    function make() {
        return new U.C().w;
    }
    U.make = make;
})(U || (U = {}));
var U;
