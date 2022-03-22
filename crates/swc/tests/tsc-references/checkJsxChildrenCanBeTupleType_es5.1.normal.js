import * as swcHelpers from "@swc/helpers";
// @jsx: react
// @strict: true
// @esModuleInterop: true
/// <reference path="/.lib/react16.d.ts" />
import React from "react";
var ResizablePanel = /*#__PURE__*/ function(_Component) {
    "use strict";
    swcHelpers.inherits(ResizablePanel, _Component);
    var _super = swcHelpers.createSuper(ResizablePanel);
    function ResizablePanel() {
        swcHelpers.classCallCheck(this, ResizablePanel);
        return _super.apply(this, arguments);
    }
    return ResizablePanel;
}(React.Component);
var test = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
var testErr = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
