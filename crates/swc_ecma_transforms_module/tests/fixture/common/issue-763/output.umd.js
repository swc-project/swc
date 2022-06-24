(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("../../../../consts"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "../../../../consts"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.consts);
})(this, function(exports, _consts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const resources = [
        {
            value: _consts.RESOURCE_WEBSITE,
            label: "Webové stránky"
        },
        {
            value: _consts.RESOURCE_FACEBOOK,
            label: "Facebook"
        },
        {
            value: _consts.RESOURCE_INSTAGRAM,
            label: "Instagram"
        }, 
    ];
});
