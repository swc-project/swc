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
const _consts = require("../../../../consts");
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
class Contacts extends Component {
    constructor(...args){
        super(...args), _define_property(this, "renderWebsites", (websites)=>{
            return websites.map((website, idx)=>/*#__PURE__*/ React.createElement("div", null, resources.map((resource)=>/*#__PURE__*/ React.createElement("option", {
                        key: resource.value,
                        value: resource.value
                    }, resource.label))));
        }), _define_property(this, "render", ()=>{
            const { websites } = this.props;
            return /*#__PURE__*/ React.createElement(Fragment, null, websites && this.renderWebsites(websites));
        });
    }
}
