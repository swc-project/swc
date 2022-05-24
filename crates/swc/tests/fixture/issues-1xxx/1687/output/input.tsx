import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
import _sliced_to_array from "@swc/helpers/lib/_sliced_to_array.js";
import "core-js/modules/es.object.to-string.js";
import "core-js/modules/es.promise.js";
import regeneratorRuntime from "regenerator-runtime";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import zhCN from "antd/es/locale/zh_CN";
import { Button, ConfigProvider } from "antd";
function App() {
    var ref = _sliced_to_array(useState({}), 2), state = ref[0], setState = ref[1];
    useEffect(function() {
        _async_to_generator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.t0 = setState;
                        _ctx.next = 3;
                        return fetch("/api/user");
                    case 3:
                        _ctx.t1 = _ctx.sent;
                        (0, _ctx.t0)(_ctx.t1);
                    case 5:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, []);
    return /*#__PURE__*/ _jsxs(ConfigProvider, {
        locale: zhCN,
        children: [
            "state: ",
            state,
            /*#__PURE__*/ _jsx(Button, {
                children: "Antd"
            })
        ]
    });
}
render(/*#__PURE__*/ _jsx(App, {}), document.getElementById("root"));
