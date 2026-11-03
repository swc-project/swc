import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
const ChildrenFail = (props)=>{
    return array.map((label)=>/*#__PURE__*/ _createElement(WrapperWhereMagicHappens, {
            ...props,
            key: label
        }, /*#__PURE__*/ _jsx("h2", {
            children: label
        }))
    );
};
