//// [checkJsxChildrenProperty16.tsx]
export var Test = function() {
    return React.createElement(React.Fragment, null, React.createElement(Foo, null, function(value) {}), React.createElement(Foo, {
        renderNumber: !0
    }, function(value) {}), React.createElement(Foo, {
        children: function(value) {}
    }), React.createElement(Foo, {
        renderNumber: !0,
        children: function(value) {}
    }));
};
