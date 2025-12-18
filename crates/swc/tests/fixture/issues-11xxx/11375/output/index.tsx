import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
export default function DropdownNavbarItemDesktop(_0) {
    var items = _0.items, props = _object_without_properties(_0, [
        "items"
    ]);
    var _props_children;
    return React.createElement("div", null, React.createElement(NavbarNavLink, {
        onClick: props.to ? undefined : function(e) {
            return e.preventDefault();
        }
    }, (_props_children = props.children) !== null && _props_children !== void 0 ? _props_children : props.label));
}
