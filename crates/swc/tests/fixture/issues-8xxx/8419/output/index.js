import { _ as _extends } from "@swc/helpers/_/_extends";
import { _ as _object_without_properties_loose } from "@swc/helpers/_/_object_without_properties_loose";
import { jsx as _jsx } from "@emotion/react/jsx-runtime";
export const SearchLayoutRoot = (_param)=>{
    var { children, sx } = _param, others = _object_without_properties_loose(_param, [
        "children",
        "sx"
    ]);
    return /*#__PURE__*/ _jsx(Box, _extends({
        sx: [
            styles,
            ...packSX(sx)
        ]
    }, others, {
        children: children
    }));
};
