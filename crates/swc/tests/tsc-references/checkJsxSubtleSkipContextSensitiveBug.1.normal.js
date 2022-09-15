//// [checkJsxSubtleSkipContextSensitiveBug.tsx]
/// <reference path="/.lib/react16.d.ts" />
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import * as React from "react";
var AsyncLoader = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(AsyncLoader, _Component);
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
