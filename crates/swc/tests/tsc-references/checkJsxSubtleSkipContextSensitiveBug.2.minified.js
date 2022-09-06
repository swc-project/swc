//// [checkJsxSubtleSkipContextSensitiveBug.tsx]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import * as React from "react";
!function(_Component) {
    "use strict";
    _inherits(AsyncLoader, _Component);
    var _super = _create_super(AsyncLoader);
    function AsyncLoader() {
        return _class_call_check(this, AsyncLoader), _super.apply(this, arguments);
    }
    return AsyncLoader.prototype.render = function() {
        return null;
    }, AsyncLoader;
}(React.Component);
