import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import React from 'react';
import { withRouter } from 'react-router-dom';
var App = function(_React_Component) {
    "use strict";
    _inherits(App, _React_Component);
    var _super = _create_super(App);
    function App() {
        _class_call_check(this, App);
        return _super.apply(this, arguments);
    }
    _create_class(App, [
        {
            key: "render",
            value: function render() {
                console.log(this.props);
                return React.createElement("div", null, "134");
            }
        }
    ]);
    return App;
}(React.Component);
export { App as default };
App = _ts_decorate([
    withRouter
], App);
