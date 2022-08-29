//// [computedPropertyNames19_ES6.ts]
var M;
(function(M) {
    var obj = {
        [this.bar]: 0
    };
})(M || (M = {}));
