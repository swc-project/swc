var y = undefined;
function destructure(something, haveValue, haveY) {
    return something === y ? haveY(y) : haveValue(something);
}
var value = Math.random() > 0.5 ? "hey!" : undefined;
var result = destructure(value, function(text) {
    return "string";
}, function(y) {
    return "other one";
}); // text: string, y: Y
// Repro from #4212
function isVoid(value) {
    return undefined;
}
function isNonVoid(value) {
    return undefined;
}
function foo1(value) {
    if (isVoid(value)) {
        value; // value is void
    } else {
        value; // value is a
    }
}
function baz1(value) {
    if (isNonVoid(value)) {
        value; // value is a
    } else {
        value; // value is void
    }
}
function get(x) {
    return null; // just an example
}
var foo;
get(foo).toUpperCase(); // Ok
pigify(mbp).oinks; // OK, mbp is treated as Pig
pigify(mbp).walks; // Ok, mbp is treated as Man
var createTestAsync = function() {
    return Promise.resolve().then(function() {
        return {
            name: "test"
        };
    });
};
var createTest = function() {
    return {
        name: "test"
    };
};
var x1 = f1("a");
var x2 = f2("a", "b");
// Repro from #30442
var func = function() {};
var assign = function(a, b) {
    return Object.assign(a, b);
};
var res = assign(function() {}, {
    func: func
});
