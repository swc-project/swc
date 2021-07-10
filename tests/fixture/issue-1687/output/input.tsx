import * as swcHelpers from "@swc/helpers";
import   "core-js/modules/es.object.to-string";
import   "core-js/modules/es.promise";
import regeneratorRuntime from "regenerator-runtime";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { render } from 'react-dom';
import zhCN from 'antd/es/locale/zh_CN';
import { Button, ConfigProvider } from 'antd';
function App() {
    var ref = swcHelpers.slicedToArray(useState({
    }), 2), state = ref[0], setState = ref[1];
    useEffect(function() {
        swcHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return fetch('/api/user');
                    case 2:
                        setState(_ctx.sent);
                    case 3:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    }, []);
    return(/*#__PURE__*/ _jsxs(ConfigProvider, {
        locale: zhCN,
        children: [
            "state: ",
            state,
            /*#__PURE__*/ _jsx(Button, {
                children: "Antd"
            })
        ]
    }));
}
render(/*#__PURE__*/ _jsx(App, {
}), document.getElementById('root'));
