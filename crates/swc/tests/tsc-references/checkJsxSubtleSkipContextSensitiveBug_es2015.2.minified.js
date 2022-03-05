import * as swcHelpers from "@swc/helpers";
import * as React from "react";
class AsyncLoader extends React.Component {
    render() {
        return null;
    }
}
function _load() {
    return (_load = swcHelpers.asyncToGenerator(function*() {
        return {
            success: !0
        };
    })).apply(this, arguments);
}
React.createElement(AsyncLoader, {
    prop1: function() {
        return _load.apply(this, arguments);
    },
    prop2: (result)=>result
});
