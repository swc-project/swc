import * as swcHelpers from "@swc/helpers";
// @strict: true
// @jsx: react
// @lib: es6
// @skipLibCheck: true
/// <reference path="/.lib/react16.d.ts" />
import * as React from "react";
class AsyncLoader extends React.Component {
    render() {
        return null;
    }
}
function load() {
    return _load.apply(this, arguments);
}
function _load() {
    _load = swcHelpers.asyncToGenerator(function*() {
        return {
            success: true
        };
    });
    return _load.apply(this, arguments);
}
const loader = /*#__PURE__*/ React.createElement(AsyncLoader, {
    prop1: load,
    prop2: (result)=>result
});
