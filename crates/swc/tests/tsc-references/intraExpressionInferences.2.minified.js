//// [intraExpressionInferences.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
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
}), Foo(_object_spread({}, {
    a: function(x1) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
})), nested({
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
}), twoConsumers({
    a: function(arg) {
        return [
            arg
        ];
    },
    consume1: function(arg1) {},
    consume2: function(arg2) {}
}), multipleProducersBeforeConsumers({
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
}), withConditionalExpression({
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
        return !!arg;
    }
}), onion({
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
                return !!arg;
            }
        }
    }
}), onion2({
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
                return !!arg;
            }
        }
    }
}), distant({
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
