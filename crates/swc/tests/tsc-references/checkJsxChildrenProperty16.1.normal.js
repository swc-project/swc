//// [checkJsxChildrenProperty16.tsx]
/// <reference path="/.lib/react16.d.ts" />
// repro from #53493
export var Test = function() {
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Foo, null, function(value) {}), /*#__PURE__*/ React.createElement(Foo, {
        renderNumber: true
    }, function(value) {}), /*#__PURE__*/ React.createElement(Foo, {
        children: function(value) {}
    }), /*#__PURE__*/ React.createElement(Foo, {
        renderNumber: true,
        children: function(value) {}
    }));
};
