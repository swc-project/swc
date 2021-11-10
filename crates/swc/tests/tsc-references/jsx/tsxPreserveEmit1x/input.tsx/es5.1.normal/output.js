//@Filename: test.tsx
// Should emit 'react-router' in the AMD dependency list
var React1 = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var routes1 = /*#__PURE__*/ React.createElement(Route, null);
var M1;
(function(M) {
    var X;
    M.X = X;
})(M1 || (M1 = {
}));
(function(M) {
    // Should emit 'M.X' in both opening and closing tags
    var y = /*#__PURE__*/ React.createElement(X, null);
})(M1 || (M1 = {
}));
//@module: amd
//@jsx: preserve
//@target: ES5
//@Filename: react.d.ts
export { };
