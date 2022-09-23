import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.object.to-string.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import zhCN from "antd/es/locale/zh_CN";
import { Button, ConfigProvider } from "antd";
function App() {
    var ref = _sliced_to_array(useState({}), 2), state = ref[0], setState = ref[1];
    useEffect(function() {
        _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            fetch("/api/user")
                        ];
                    case 1:
                        setState.apply(void 0, [
                            _state.sent()
                        ]);
                        return [
                            2
                        ];
                }
            });
        })();
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
