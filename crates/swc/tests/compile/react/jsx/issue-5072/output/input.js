import React from "react";
import ReactDOM from "react-dom";
import { Button, Input } from "antd";
import Child from "./component/Child";
class Page extends React.Component {
    render() {
        return /*#__PURE__*/ React.createElement("div", {
            className: "test"
        }, /*#__PURE__*/ React.createElement("div", null, "Page"), /*#__PURE__*/ React.createElement(Child, null), /*#__PURE__*/ React.createElement("input", {
            placeholder: "我是谁?"
        }), /*#__PURE__*/ React.createElement(Button, null, "click me"), /*#__PURE__*/ React.createElement(Input, null));
    }
}
