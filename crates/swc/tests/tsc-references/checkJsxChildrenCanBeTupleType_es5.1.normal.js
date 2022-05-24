import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @jsx: react
// @strict: true
// @esModuleInterop: true
/// <reference path="/.lib/react16.d.ts" />
import React from "react";
var ResizablePanel = /*#__PURE__*/ function(_Component) {
    "use strict";
    _inherits(ResizablePanel, _Component);
    var _super = _create_super(ResizablePanel);
    function ResizablePanel() {
        _class_call_check(this, ResizablePanel);
        return _super.apply(this, arguments);
    }
    return ResizablePanel;
}(React.Component);
var test = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
var testErr = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
