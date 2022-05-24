import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
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
    _load = _async_to_generator(function*() {
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
