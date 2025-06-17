import { jsx as _jsx } from "react/jsx-runtime";
export const Foo = (props)=>{
    return originalMessage ? /*#__PURE__*/ _jsx(Bar, {
        children: /*#__PURE__*/ _jsx(Baz, {
            children: ()=>null
        })
    }) : null;
};
