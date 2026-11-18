"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Contacts;
    }
});
const _consts = require("./consts");
const _react = /*#__PURE__*/ _interop_require_wildcard(require("react"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
            else newObj[key] = obj[key];
        }
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
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
    }
];
class Contacts extends _react.Component {
    constructor(...args){
        super(...args), _define_property(this, "renderWebsites", (websites)=>{
            return websites.map((website, idx)=>/*#__PURE__*/ _react.default.createElement("div", {
                    key: idx
                }, /*#__PURE__*/ _react.default.createElement("div", null, resources.map((resource)=>/*#__PURE__*/ _react.default.createElement("option", {
                        key: resource.value,
                        value: resource.value
                    }, resource.label))), /*#__PURE__*/ _react.default.createElement("input", {
                    type: website.type_id === _consts.RESOURCE_INSTAGRAM ? "text" : "url",
                    value: website.value || ""
                })));
        }), _define_property(this, "render", ()=>{
            const { websites } = this.props;
            return /*#__PURE__*/ _react.default.createElement(_react.Fragment, null, websites && this.renderWebsites(websites));
        });
    }
}
