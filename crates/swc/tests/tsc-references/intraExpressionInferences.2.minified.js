//// [intraExpressionInferences.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
callIt({
    produce: function() {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
}), callIt({
    produce: function(_a) {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
}), callIt({
    produce: function() {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
}), callItT([
    function() {
        return 0;
    },
    function(n) {
        return n.toFixed();
    }
]), callItT([
    function(_a) {
        return 0;
    },
    function(n) {
        return n.toFixed();
    }
]), foo({
    a: function() {
        return 42;
    },
    b: function(a) {}
}), foo({
    a: function() {
        return 42;
    },
    b: function(a) {}
}), foo({
    a: function() {
        return 42;
    },
    b: function(a) {}
});
var Wrapper = function Wrapper() {
    _class_call_check(this, Wrapper);
};
function example(options) {
    return function(params) {
        var data = options.fetch(params, 123);
        return options.map(data);
    };
}
createMappingComponent({
    setup: function() {
        return {
            inputs: {
                num: new Wrapper(),
                str: new Wrapper()
            },
            outputs: {
                bool: new Wrapper(),
                str: new Wrapper()
            }
        };
    },
    map: function(inputs) {
        return {
            bool: inputs.nonexistent,
            str: inputs.num
        };
    }
}), example({
    fetch: function(params) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
}), example({
    fetch: function(params, foo1) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
}), example({
    fetch: function(params, foo1) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
}), branch({
    test: x,
    if: function(t) {
        return "a" === t;
    },
    then: function(u) {}
});
