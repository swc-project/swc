//// [intraExpressionInferences.ts]
// Repros from #47599
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
callIt({
    produce: function() {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
});
callIt({
    produce: function(_a) {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
});
callIt({
    produce: function produce() {
        return 0;
    },
    consume: function(n) {
        return n.toFixed();
    }
});
callItT([
    function() {
        return 0;
    },
    function(n) {
        return n.toFixed();
    }
]);
callItT([
    function(_a) {
        return 0;
    },
    function(n) {
        return n.toFixed();
    }
]);
var inferTypeFn = function(generic) {
    return generic;
};
var myGeneric = inferTypeFn({
    retrieveGeneric: function(parameter) {
        return 5;
    },
    operateWithGeneric: function(generic) {
        return generic.toFixed();
    }
});
// Repro #38623
function make(o) {}
make({
    mutations: {
        foo: function foo1() {}
    },
    action: function(a) {
        a.foo();
    }
});
foo({
    a: function() {
        return 42;
    },
    b: function b(a) {}
});
foo({
    a: function a() {
        return 42;
    },
    b: function b(a) {}
});
foo({
    a: function a() {
        return 42;
    },
    b: function b(a) {}
});
function test(foo1) {}
test({
    a: function() {
        return 0;
    },
    b: function(a) {
        return 'a';
    },
    c: function(b) {
        var _$x = b;
    }
});
test({
    a: function() {
        return 0;
    },
    b: function(a) {
        return a;
    },
    c: function(b) {
        var _$x = b;
    }
});
// Repro from #41712
var Wrapper = function Wrapper() {
    "use strict";
    _class_call_check(this, Wrapper);
};
createMappingComponent({
    setup: function setup() {
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
    map: function map(inputs) {
        return {
            bool: inputs.nonexistent,
            str: inputs.num
        };
    }
});
// Repro from #48279
function simplified(props) {}
function whatIWant(props) {}
function nonObject(generator, receiver) {}
simplified({
    generator: function() {
        return 123;
    },
    receiver: function(t) {
        return console.log(t + 2);
    }
});
whatIWant({
    generator: function(bob) {
        return bob ? 1 : 2;
    },
    receiver: function(t) {
        return console.log(t + 2);
    }
});
nonObject(function(bob) {
    return bob ? 1 : 2;
}, function(t) {
    return console.log(t + 2);
});
function example(options) {
    return function(params) {
        var data = options.fetch(params, 123);
        return options.map(data);
    };
}
example({
    fetch: function(params) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
});
example({
    fetch: function(params, foo1) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
});
example({
    fetch: function(params, foo1) {
        return 123;
    },
    map: function(number) {
        return String(number);
    }
});
branch({
    test: x,
    if: function(t) {
        return t === "a";
    },
    then: function(u) {
        var test1 = u;
    }
});
Foo(_object_spread({}, {
    a: function(x1) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
}));
var resNested = nested({
    prop: {
        produce: function(a) {
            return [
                a
            ];
        },
        consume: function(arg) {
            return arg.join(",");
        }
    }
});
var resTwoConsumers = twoConsumers({
    a: function(arg) {
        return [
            arg
        ];
    },
    consume1: function(arg1) {},
    consume2: function(arg2) {}
});
var resMultipleProducersBeforeConsumers = multipleProducersBeforeConsumers({
    a: function(arg) {
        return [
            arg
        ];
    },
    b: function(arg) {
        return Number(arg);
    },
    consume1: function(arg1) {},
    consume2: function(arg2) {}
});
var resWithConditionalExpression = withConditionalExpression({
    a: function(arg) {
        return [
            arg
        ];
    },
    b: Math.random() ? function(arg) {
        return "first";
    } : function(arg) {
        return "two";
    },
    c: function(arg) {
        return Boolean(arg);
    }
});
var resOnion = onion({
    a: function(arg) {
        return [
            arg
        ];
    },
    nested: {
        b: function(arg) {
            return arg.join(",");
        },
        nested2: {
            c: function(arg) {
                return Boolean(arg);
            }
        }
    }
});
var resOnion2 = onion2({
    a: function(arg) {
        return [
            arg
        ];
    },
    nested: {
        b: function(arg) {
            return arg.join(",");
        },
        c: function(arg) {
            return Number(arg);
        },
        nested2: {
            d: function(arg) {
                return Boolean(arg);
            }
        }
    }
});
var distantRes = distant({
    foo: {
        bar: {
            baz: {
                producer: function(arg) {
                    return 1;
                }
            }
        }
    },
    consumer: function(val) {}
});
