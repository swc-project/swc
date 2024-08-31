//// [checkJsxChildrenCanBeTupleType.tsx]
/// <reference path="/.lib/react16.d.ts" />
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import React from 'react';
var ResizablePanel = /*#__PURE__*/ function(_React_Component) {
    "use strict";
    _inherits(ResizablePanel, _React_Component);
    function ResizablePanel() {
        _class_call_check(this, ResizablePanel);
        return _call_super(this, ResizablePanel, arguments);
    }
    return ResizablePanel;
}(React.Component);
var test = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
var testErr = /*#__PURE__*/ React.createElement(ResizablePanel, null, /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null), /*#__PURE__*/ React.createElement("div", null));
