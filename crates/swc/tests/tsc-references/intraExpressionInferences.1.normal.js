//// [intraExpressionInferences.ts]
// Repros from #47599
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
callIt({
    produce: function produce() {
        return 0;
    },
    consume: function consume(n) {
        return n.toFixed();
    }
});
callIt({
    produce: function produce(_a) {
        return 0;
    },
    consume: function consume(n) {
        return n.toFixed();
    }
});
callIt({
    produce: function produce() {
        return 0;
    },
    consume: function consume(n) {
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
var inferTypeFn = function inferTypeFn(generic) {
    return generic;
};
var myGeneric = inferTypeFn({
    retrieveGeneric: function retrieveGeneric(parameter) {
        return 5;
    },
    operateWithGeneric: function operateWithGeneric(generic) {
        return generic.toFixed();
    }
});
// Repro #38623
function make(o) {}
make({
    mutations: {
        foo: function foo1() {}
    },
    action: function action(a) {
        a.foo();
    }
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
foo({
    a: function a() {
        return 42;
    },
    b: function b(a) {}
});
function test(foo1) {}
test({
    a: function a() {
        return 0;
    },
    b: function b(a) {
        return 'a';
    },
    c: function c(b) {
        var _$x = b;
    }
});
test({
    a: function a() {
        return 0;
    },
    b: function b(a) {
        return a;
    },
    c: function c(b) {
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
    generator: function generator() {
        return 123;
    },
    receiver: function receiver(t) {
        return console.log(t + 2);
    }
});
whatIWant({
    generator: function generator(bob) {
        return bob ? 1 : 2;
    },
    receiver: function receiver(t) {
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
    fetch: function fetch(params) {
        return 123;
    },
    map: function map(number) {
        return String(number);
    }
});
example({
    fetch: function fetch(params, foo1) {
        return 123;
    },
    map: function map(number) {
        return String(number);
    }
});
example({
    fetch: function fetch(params, foo1) {
        return 123;
    },
    map: function map(number) {
        return String(number);
    }
});
branch({
    test: x,
    if: function _if(t) {
        return t === "a";
    },
    then: function then(u) {
        var test1 = u;
    }
});
Foo(_object_spread({}, {
    a: function a(x1) {
        return 10;
    },
    b: function b(arg) {
        arg.toString();
    }
}));
var resNested = nested({
    prop: {
        produce: function produce(a) {
            return [
                a
            ];
        },
        consume: function consume(arg) {
            return arg.join(",");
        }
    }
});
var resTwoConsumers = twoConsumers({
    a: function a(arg) {
        return [
            arg
        ];
    },
    consume1: function consume1(arg1) {},
    consume2: function consume2(arg2) {}
});
var resMultipleProducersBeforeConsumers = multipleProducersBeforeConsumers({
    a: function a(arg) {
        return [
            arg
        ];
    },
    b: function b(arg) {
        return Number(arg);
    },
    consume1: function consume1(arg1) {},
    consume2: function consume2(arg2) {}
});
var resWithConditionalExpression = withConditionalExpression({
    a: function a(arg) {
        return [
            arg
        ];
    },
    b: Math.random() ? function(arg) {
        return "first";
    } : function(arg) {
        return "two";
    },
    c: function c(arg) {
        return Boolean(arg);
    }
});
var resOnion = onion({
    a: function a(arg) {
        return [
            arg
        ];
    },
    nested: {
        b: function b(arg) {
            return arg.join(",");
        },
        nested2: {
            c: function c(arg) {
                return Boolean(arg);
            }
        }
    }
});
var resOnion2 = onion2({
    a: function a(arg) {
        return [
            arg
        ];
    },
    nested: {
        b: function b(arg) {
            return arg.join(",");
        },
        c: function c(arg) {
            return Number(arg);
        },
        nested2: {
            d: function d(arg) {
                return Boolean(arg);
            }
        }
    }
});
var distantRes = distant({
    foo: {
        bar: {
            baz: {
                producer: function producer(arg) {
                    return 1;
                }
            }
        }
    },
    consumer: function consumer(val) {}
});
