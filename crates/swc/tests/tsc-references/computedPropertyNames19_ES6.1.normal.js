//// [computedPropertyNames19_ES6.ts]
(function(M) {
    var obj = {
        [this.bar]: 0
    };
})(M || (M = {}));
var M;
