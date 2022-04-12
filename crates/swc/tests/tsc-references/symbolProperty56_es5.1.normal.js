import * as swcHelpers from "@swc/helpers";
//@target: ES6
var obj = swcHelpers.defineProperty({}, Symbol.iterator, 0);
var M;
(function(M) {
    var _$Symbol;
    // The following should be of type 'any'. This is because even though obj has a property keyed by Symbol.iterator,
    // the key passed in here is the *wrong* Symbol.iterator. It is not the iterator property of the global Symbol.
    obj[_$Symbol["iterator"]];
})(M || (M = {}));
