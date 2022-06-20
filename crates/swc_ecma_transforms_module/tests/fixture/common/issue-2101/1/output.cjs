"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    render: ()=>_customRender.customRender
});
var _customRender = require("./customRender");
_reExport(exports, require("@testing-library/react"));
