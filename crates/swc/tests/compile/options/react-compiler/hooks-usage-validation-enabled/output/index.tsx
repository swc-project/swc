import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState } from 'react';
// Calls a hook conditionally and carries no ESLint suppression comment, so only
// the hooks-usage validation can make the compiler skip it.
export function Toggle(param) {
    var enabled = param.enabled;
    if (enabled) {
        var _useState = _sliced_to_array(useState(false), 2), on = _useState[0], setOn = _useState[1];
        return /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return setOn(!on);
            }
        }, String(on));
    }
    return null;
}
