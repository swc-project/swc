import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export function Counter(param) {
    var step = param.step;
    var _useState = _sliced_to_array(useState(0), 2), count = _useState[0], setCount = _useState[1];
    useEffect(function() {
        setCount(function(c) {
            return c + step;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return /*#__PURE__*/ _jsx("button", {
        onClick: function onClick() {
            return setCount(function(c) {
                return c + 1;
            });
        },
        children: count
    });
}
