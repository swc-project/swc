//// [intraExpressionInferencesJsx.tsx]
/// <reference path="/.lib/react16.d.ts" />
// repro from #52798
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
var Component = function(param) {
    var animations = param.animations, style = param.style;
    return /*#__PURE__*/ _jsx(_Fragment, {});
};
/*#__PURE__*/ _jsx(Component, {
    animations: {
        test: {
            kind: "a",
            value: 1,
            a: true
        }
    },
    style: function(anim) {
        return "";
    }
});
/*#__PURE__*/ _jsx(Component, {
    animations: {
        test: {
            kind: "a",
            value: 1,
            a: true,
            func: function func() {
                return {
                    a: true
                };
            }
        }
    },
    style: function(anim) {
        return "";
    }
});
/*#__PURE__*/ _jsx(Component, {
    animations: {
        test: {
            kind: "a",
            value: 1,
            a: true,
            func: function() {
                return {
                    a: true
                };
            }
        }
    },
    style: function(anim) {
        return "";
    }
});
function Foo(props) {
    return /*#__PURE__*/ _jsx("div", {});
}
/*#__PURE__*/ _jsx(Foo, {
    a: function() {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
/*#__PURE__*/ _jsx(Foo, {
    a: function(x) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
/*#__PURE__*/ _jsx(Foo, {
    a: function(x) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
