import { jsx as _jsx } from "react/jsx-runtime";
export const Foo = (props)=>{
    return originalMessage ? _jsx(Bar, {
        children: _jsx(Baz, {
            children: ()=>null
        })
    }) : null;
};
