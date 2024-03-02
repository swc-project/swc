//// [assertionTypePredicates2.js]
var foo = function(a) {
    if (0 !== a.y) throw TypeError();
};
export var main = function() {
    foo({
        x: 1
    });
};
