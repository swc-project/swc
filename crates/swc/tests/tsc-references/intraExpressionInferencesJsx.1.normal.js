//// [intraExpressionInferencesJsx.tsx]
/// <reference path="/.lib/react16.d.ts" />
// repro from #52798
var Component = function(param) {
    var animations = param.animations, style = param.style;
    return /*#__PURE__*/ React.createElement(React.Fragment, null);
};
/*#__PURE__*/ React.createElement(Component, {
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
/*#__PURE__*/ React.createElement(Component, {
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
/*#__PURE__*/ React.createElement(Component, {
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
    return /*#__PURE__*/ React.createElement("div", null);
}
/*#__PURE__*/ React.createElement(Foo, {
    a: function() {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
/*#__PURE__*/ React.createElement(Foo, {
    a: function(x) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
/*#__PURE__*/ React.createElement(Foo, {
    a: function(x) {
        return 10;
    },
    b: function(arg) {
        arg.toString();
    }
});
