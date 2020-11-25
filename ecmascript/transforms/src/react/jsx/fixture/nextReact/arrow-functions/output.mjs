import { jsx as _jsx } from "react/jsx-runtime";
var foo = function() {
    return (function() {
        return _jsx(this, {
        });
    }).bind(this);
};
var bar = function() {
    return (function() {
        return _jsx(this.foo, {
        });
    }).bind(this);
};
