//// [checkJsxSubtleSkipContextSensitiveBug.tsx]
/// <reference path="/.lib/react16.d.ts" />
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import * as React from "react";
var AsyncLoader = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(AsyncLoader, _React_Component);
    var _super = _create_super(AsyncLoader);
    function AsyncLoader() {
        _class_call_check(this, AsyncLoader);
        return _super.apply(this, arguments);
    }
    var _proto = AsyncLoader.prototype;
    _proto.render = function render() {
        return null;
    };
    return AsyncLoader;
}(React.Component);
function load() {
    return _load.apply(this, arguments);
}
function _load() {
    _load = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2,
                {
                    success: true
                }
            ];
        });
    });
    return _load.apply(this, arguments);
}
var loader = /*#__PURE__*/ React.createElement(AsyncLoader, {
    prop1: load,
    prop2: function(result) {
        return result;
    }
});
