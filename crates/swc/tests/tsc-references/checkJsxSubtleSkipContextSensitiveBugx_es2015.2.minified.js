import * as React from "react";
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
class AsyncLoader extends React.Component {
    render() {
        return null;
    }
}
function _load() {
    return (_load = (function(fn) {
        return function() {
            var self = this, args = arguments;
            return new Promise(function(resolve, reject) {
                var gen = fn.apply(self, args);
                function _next(value) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
                }
                function _throw(err) {
                    asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
                }
                _next(void 0);
            });
        };
    })(function*() {
        return {
            success: !0
        };
    })).apply(this, arguments);
}
React.createElement(AsyncLoader, {
    prop1: function() {
        return _load.apply(this, arguments);
    },
    prop2: (result)=>result
});
